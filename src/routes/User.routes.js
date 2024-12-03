import {Router} from 'express'
import { getChanneldetails, getCurrentUser, getWatchHistory, loginuser, Logoutuser, registeruser, updateAccountDetails, updateAvatar, updateCover, updatePassword} from '../controllers/User.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { Tokenverification } from '../middlewares/auth.middleware.js'

const UserRouter =Router() 

UserRouter.route('/register').post(
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

UserRouter.route('/login').post(loginuser)

UserRouter.route('/logout').post(Tokenverification,Logoutuser)

UserRouter.route('/updatepassword').post(Tokenverification,updatePassword)

UserRouter.route('/getuser').get(Tokenverification,getCurrentUser)

UserRouter.route('/updateprofile').patch(Tokenverification, updateAccountDetails)

UserRouter.route('/updateavatar').patch(Tokenverification,upload.single('avatar'), updateAvatar)

UserRouter.route('/updatecover').patch(Tokenverification,upload.single('coverimage'), updateCover)

UserRouter.route('/channel/:username').get(Tokenverification,getChanneldetails)

UserRouter.route('/watchhistry').get(Tokenverification,getWatchHistory)


export default UserRouter