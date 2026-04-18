import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from '../middleware/auth.middleware'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

const router = Router()

router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) { res.status(400).json({ error: '未收到檔案', code: 'UPLOAD_FAILED' }); return }
  res.status(201).json({ data: { filename: req.file.filename, url: `/api/v1/uploads/${req.file.filename}` } })
})

export default router
