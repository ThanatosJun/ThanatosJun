// Live2D app — plain JS (no TypeScript syntax) so esbuild can process it
import { CubismFramework, LogLevel } from './live2d/live2dcubismframework'
import { CubismModelSettingJson } from './live2d/cubismmodelsettingjson'
import { CubismUserModel } from './live2d/model/cubismusermodel'
import { CubismMatrix44 } from './live2d/math/cubismmatrix44'
import { CubismBreath, BreathParameterData } from './live2d/effect/cubismbreath'
import { CubismEyeBlink } from './live2d/effect/cubismeyeblink'

const MODEL_BASE = `${import.meta.env.BASE_URL}live2d/Hiyori/`
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
    img.onerror = reject
    img.src = url
  })
}

class HiyoriModel extends CubismUserModel {
  constructor() {
    super()
    this._idleMotions = []
    this._idleIndex = 0
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

    // 9. Preload idle motions
    const idleCount = modelSetting.getMotionCount('Idle')
    for (let i = 0; i < idleCount; i++) {
      const motionFile = modelSetting.getMotionFileName('Idle', i)
      try {
        const buf = await fetchBuffer(MODEL_BASE + motionFile)
        const motion = this.loadMotion(
          buf, buf.byteLength, `Idle_${i}`,
          null, null, modelSetting, 'Idle', i
        )
        this._idleMotions.push(motion)
      } catch {
        // skip missing motion file
      }
    }

    this._startNextIdle()
  }

  _startNextIdle() {
    if (this._idleMotions.length === 0) return
    const motion = this._idleMotions[this._idleIndex % this._idleMotions.length]
    this._idleIndex++
    this._motionManager.startMotionPriority(motion, false, PRIORITY_IDLE)
  }

  tick(dt, gl, canvas) {
    if (!this._model) return

    this._model.loadParameters()

    if (this._motionManager.isFinished()) {
      this._startNextIdle()
    } else {
      this._motionManager.updateMotion(this._model, dt)
    }

    this._model.saveParameters()

    if (this._physics) this._physics.evaluate(this._model, dt)
    if (this._eyeBlink) this._eyeBlink.updateParameters(this._model, dt)
    if (this._breath) this._breath.updateParameters(this._model, dt)

    this._model.update()

    // Draw
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const w = canvas.width
    const h = canvas.height
    const aspect = w / h

    const projection = new CubismMatrix44()
    projection.loadIdentity()

    if (aspect < 1.0) {
      this._modelMatrix.setWidth(2.0)
      projection.scale(1.0, aspect)
    } else {
      this._modelMatrix.setWidth(2.0 / aspect)
      projection.scale(1.0, 1.0)
    }

    projection.translateY(-0.3)

    const mvp = new CubismMatrix44()
    CubismMatrix44.multiply(
      this._modelMatrix.getArray(),
      projection.getArray(),
      mvp.getArray()
    )

    const renderer = this.getRenderer()
    renderer.setMvpMatrix(mvp)
    renderer.drawModel()
  }
}

export async function initLive2D(canvas) {
  if (!CubismFramework.isStarted()) {
    CubismFramework.startUp({ logFunction: null, loggingLevel: LogLevel.LogLevel_Off })
    CubismFramework.initialize()
  }

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true })
  if (!gl) throw new Error('WebGL not supported')

  // Initial canvas size
  canvas.width = canvas.clientWidth || 300
  canvas.height = canvas.clientHeight || 500
  gl.viewport(0, 0, canvas.width, canvas.height)

  const model = new HiyoriModel()
  await model.setup(gl, canvas)

  let rafId
  let lastTime = performance.now()

  function loop() {
    const now = performance.now()
    const dt = Math.min((now - lastTime) / 1000, 0.1)
    lastTime = now

    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    model.tick(dt, gl, canvas)
    rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(rafId)
    model.release()
  }
}
