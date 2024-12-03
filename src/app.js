import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

// cors 
app.use(cors({
    options: process.env.FRONTEND_URL,
    credentials: true
}))

//json 
app.use(express.json({
    limit: '16kb'
}))

//url

app.use(express.urlencoded({
    extended:true,
    limit: '16kb'
}))


//cache
app.use(express.static('public'))

app.use(cookieParser())

// router import 
import UserRouter from './routes/User.routes.js'
import VideoRouter from './routes/Video.routes.js'
import TweetRouter from './routes/Tweet.routes.js'


//routing 
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/video',VideoRouter)
app.use('/api/v1/tweet',TweetRouter)



export default app