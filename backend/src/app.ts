import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes    from './routes/auth.routes'
import articlesRoutes from './routes/articles.routes'
import spacesRoutes  from './routes/spaces.routes'
import chatRoutes    from './routes/chat.routes'
import uploadsRoutes from './routes/uploads.routes'
import { errorMiddleware } from './middleware/error.middleware'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/uploads', express.static('uploads'))

app.use('/api/v1/auth',     authRoutes)
app.use('/api/v1/articles', articlesRoutes)
app.use('/api/v1/spaces',   spacesRoutes)
app.use('/api/v1/chat',     chatRoutes)
app.use('/api/v1/uploads',  uploadsRoutes)

app.use(errorMiddleware)

export default app
