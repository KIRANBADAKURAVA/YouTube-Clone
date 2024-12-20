import { Comment } from "../models/comments.model.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const getVideoComments = AsyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    
    const video = await Video.findById(videoId);

    if(!video) throw new ApiError(400, 'Video did not Found ')

        const coment = await Comment.find({
            video: videoId
        })
        if(!coment.length) {

            return res.status(200).json(new ApiResponse(200, [], 'The video donot have any comments'))
        }else{
            return res.status(200).json(new ApiResponse(200,coment,'Coments fetched succesfully'))
        }
}) 

const addComment = AsyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const userId= req.user._id
    const {videoId}= req.params 
    const {content}= req.body
    if(!userId) throw new ApiError(400, 'Unauthorized request')
        console.log(videoId);
        
        const video = await Video.findById(videoId)
        if(!video) throw new ApiError(400,'Video does not exsits')
        
    
    const comment = await Comment.create({
        content,
        owner: userId,
        video : videoId
    })

    if(!comment) throw new ApiError(500, "something went wrong")

    return res.status(200).json(new ApiResponse(200, comment, 'Coomment added successfully'))
})

const deleteComment = AsyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId}= req.params
    
    const comment = await Comment.findByIdAndDelete(commentId);

    if(!comment) throw new ApiError(400, 'Invalid comment ID')

    return res.status(200).json(new ApiResponse(200,comment, 'Comment deleted successfully'))



})

export{
    getVideoComments,
    addComment,
    deleteComment
}