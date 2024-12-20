import {Router} from 'express'
import { Tokenverification } from '../middlewares/auth.middleware.js'
import { addComment, deleteComment, getVideoComments } from '../controllers/Coment.controller.js'


const ComentRouter = Router()

ComentRouter.route('/createcoment/:videoId').post(Tokenverification, addComment)
ComentRouter.route('/getcomment/:videoId').get(Tokenverification, getVideoComments)
ComentRouter.route('/delete/:commentId').delete(Tokenverification, deleteComment)

export default ComentRouter