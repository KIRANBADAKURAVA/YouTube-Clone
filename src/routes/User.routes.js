import {Router} from 'express'
import { loginuser, Logoutuser, registeruser, } from '../controllers/User.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { Tokenverification } from '../middlewares/auth.middleware.js'

const router =Router() 

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverimage',
            maxCount: 1
        }
    ]),
    registeruser
)

router.route('/login').post(loginuser)

router.route('/logout').post(Tokenverification,Logoutuser)


export default router