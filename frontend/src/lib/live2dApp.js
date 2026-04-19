// Live2D app — plain JS (no TypeScript syntax) so esbuild can process it
import { CubismFramework, LogLevel } from './live2d/live2dcubismframework'
import { CubismModelSettingJson } from './live2d/cubismmodelsettingjson'
import { CubismUserModel } from './live2d/model/cubismusermodel'
import { CubismMatrix44 } from './live2d/math/cubismmatrix44'
import { CubismBreath, BreathParameterData } from './live2d/effect/cubismbreath'
import { CubismEyeBlink } from './live2d/effect/cubismeyeblink'

const MODEL_BASE = `${import.meta.env.BASE_URL}live2d/Hiyori/`
const SHADER_BASE = `${import.meta.env.BASE_URL}live2d/shaders/`
const PRIORITY_IDLE = 1

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.arrayBuffer()
}

async function loadGLTexture(gl, url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.bindTexture(gl.TEXTURE_2D, null)
      resolve(tex)
    }
    img.onerror = () => reject(new Error(`Failed to load texture: ${url}`))
    img.src = url
  })
}

const PRIORITY_FORCE = 3

class HiyoriModel extends CubismUserModel {
  constructor() {
    super()
    this._idleMotions = []
    this._tapMotions  = []
    this._idleIndex   = 0
    this._eyeBlinkIds = []
    this._lipSyncIds  = []
  }

  async setup(gl, canvas) {
    // 1. Parse model settings
    const modelJsonBuf = await fetchBuffer(MODEL_BASE + 'Hiyori.model3.json')
    const modelSetting = new CubismModelSettingJson(modelJsonBuf, modelJsonBuf.byteLength)

    // 2. Load moc3
    const mocBuf = await fetchBuffer(MODEL_BASE + modelSetting.getModelFileName())
    this.loadModel(mocBuf)

    // 3. Create renderer and attach WebGL
    this.createRenderer(canvas.width, canvas.height)
    const renderer = this.getRenderer()
    renderer.setIsPremultipliedAlpha(true)
    renderer.startUp(gl)
    renderer.loadShaders(SHADER_BASE)

    // 4. Load textures
    const texCount = modelSetting.getTextureCount()
    for (let i = 0; i < texCount; i++) {
      const texFile = modelSetting.getTextureFileName(i)
      const glTex = await loadGLTexture(gl, MODEL_BASE + texFile)
      renderer.bindTexture(i, glTex)
    }

    // 5. Physics
    const physFile = modelSetting.getPhysicsFileName()
    if (physFile) {
      const buf = await fetchBuffer(MODEL_BASE + physFile)
      this.loadPhysics(buf, buf.byteLength)
    }

    // 6. Pose
    const poseFile = modelSetting.getPoseFileName()
    if (poseFile) {
      const buf = await fetchBuffer(MODEL_BASE + poseFile)
      this.loadPose(buf, buf.byteLength)
    }

    // 7. Eye blink
    this._eyeBlink = CubismEyeBlink.create(modelSetting)

    // 8. Breath
    this._breath = CubismBreath.create()
    this._breath.setParameters([
      new BreathParameterData('ParamAngleX', 0, 15, 6.5345, 0.5),
      new BreathParameterData('ParamAngleY', 0, 8, 3.5345, 0.5),
      new BreathParameterData('ParamAngleZ', 0, 10, 5.5345, 0.5),
      new BreathParameterData('ParamBodyAngleX', 0, 4, 15.5345, 0.5),
      new BreathParameterData('ParamBreath', 0.5, 0.5, 3.2345, 0.5),
    ])

    // 9. Collect eye blink / lip sync IDs (stored as instance vars for tap motions)
    for (let i = 0; i < modelSetting.getEyeBlinkParameterCount(); i++) {
      this._eyeBlinkIds.push(modelSetting.getEyeBlinkParameterId(i))
    }
    for (let i = 0; i < modelSetting.getLipSyncParameterCount(); i++) {
      this._lipSyncIds.push(modelSetting.getLipSyncParameterId(i))
    }

    const loadMotions = async (group, target) => {
      const count = modelSetting.getMotionCount(group)
      for (let i = 0; i < count; i++) {
        const file = modelSetting.getMotionFileName(group, i)
        try {
          const buf = await fetchBuffer(MODEL_BASE + file)
          const motion = this.loadMotion(buf, buf.byteLength, `${group}_${i}`,
            null, null, modelSetting, group, i)
          if (motion) {
            motion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds)
            target.push(motion)
          }
        } catch { /* skip missing */ }
      }
    }

    await loadMotions('Idle',    this._idleMotions)
    await loadMotions('TapBody', this._tapMotions)

    this._startNextIdle()
  }

  tap() {
    if (this._tapMotions.length === 0) return
    const motion = this._tapMotions[Math.floor(Math.random() * this._tapMotions.length)]
    this._motionManager.startMotionPriority(motion, false, PRIORITY_FORCE)
  }

  _startNextIdle() {
    if (this._idleMotions.length === 0) return
    const motion = this._idleMotions[this._idleIndex % this._idleMotions.length]
    this._idleIndex++
    this._motionManager.startMotionPriority(motion, false, PRIORITY_IDLE)
  }

  tick(dt, canvas) {
    if (!this._model) return

    // --- Parameter update (mirrors SDK lappmodel.ts update()) ---
    this._model.loadParameters()

    let motionUpdated = false
    if (this._motionManager.isFinished()) {
      this._startNextIdle()
    } else {
      motionUpdated = this._motionManager.updateMotion(this._model, dt)
    }

    this._model.saveParameters()

    // Eye blink only when no motion is driving the eye params (matches SDK behaviour)
    if (!motionUpdated && this._eyeBlink) {
      this._eyeBlink.updateParameters(this._model, dt)
    }

    if (this._pose) this._pose.updateParameters(this._model, dt)
    if (this._physics) this._physics.evaluate(this._model, dt)
    if (this._breath) this._breath.updateParameters(this._model, dt)

    this._model.update()

    // --- Draw (mirrors SDK lapplive2dmanager.ts onUpdate() + lappmodel.ts draw()) ---
    const { width, height } = canvas

    // Build projection matrix exactly like the SDK demo does
    const projection = new CubismMatrix44()
    if (this._model.getCanvasWidth() > 1.0 && width < height) {
      // Wide model displayed on portrait canvas
      this._modelMatrix.setWidth(2.0)
      projection.scale(1.0, width / height)
    } else {
      projection.scale(height / width, 1.0)
    }

    // Equivalent of lappmodel.draw(): projection = projection * modelMatrix
    projection.multiplyByMatrix(this._modelMatrix)

    const renderer = this.getRenderer()
    renderer.setMvpMatrix(projection)
    renderer.drawModel()
  }
}

export async function initLive2D(canvas) {
  // Start up the Cubism Framework once
  if (!CubismFramework.isStarted()) {
    CubismFramework.startUp({ logFunction: null, loggingLevel: LogLevel.LogLevel_Off })
    CubismFramework.initialize()
  }

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true })
  if (!gl) throw new Error('WebGL not supported')

  // Set canvas buffer size to match its CSS display size
  canvas.width = canvas.clientWidth || 300
  canvas.height = canvas.clientHeight || 500
  console.log('[Live2D] canvas size:', canvas.width, canvas.height)
  gl.viewport(0, 0, canvas.width, canvas.height)

  const model = new HiyoriModel()
  console.log('[Live2D] loading model...')
  await model.setup(gl, canvas)
  console.log('[Live2D] model loaded, starting loop')

  let rafId
  let lastTime = performance.now()

  function loop() {
    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    // Sync canvas buffer to CSS display size if changed
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    model.tick(dt, canvas)
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  return {
    destroy: () => { cancelAnimationFrame(rafId); model.release() },
    tap:     () => model.tap(),
  }
}
