import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { Tokenverification } from "../middlewares/auth.middleware.js";
import { getAllvideos, getVideoById, publishvideo, updateVideoDetails, deleteVideo,togglePublishStatus } from "../controllers/Video.controllers.js";


const VideoRouter = Router()
                                                                                                                      
VideoRouter.route('/publishvideo').post(Tokenverification,
    upload.fields([
        {
            name: 'thumbnail',
            maxCount: 1
        },
        {
            name: 'videoFile',
            maxCount: 1
        }
    ]),
    publishvideo
)
VideoRouter.route('/getallvideos').get( getAllvideos )

VideoRouter.route('/:videoId').get( getVideoById )

VideoRouter.route('/update/:videoId').patch( Tokenverification, upload.single('thumbnail'),updateVideoDetails )

VideoRouter.route('/delete/:videoId').patch( Tokenverification, deleteVideo )

VideoRouter.route('/toggle-publish/:videoId').patch(Tokenverification, togglePublishStatus);

export default VideoRouter