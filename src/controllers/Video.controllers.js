import {Video} from '../models/video.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/Asynchandler.js'
import {fileupload} from '../utils/cloudinary.utils.js'
import mongoose from 'mongoose'
// Publish a video
const publishvideo= AsyncHandler(async(req,res)=>{

    const {title , description}= req.body
    if(!title || !description) return new ApiError(400, "All fields are required")
    
    let thumbnaillocalpath;
    let videofilelocalpath;

    if(req.files && Array.isArray(req.files.thumbnail)&& req.files.thumbnail.length>0){
        thumbnaillocalpath= req.files.thumbnail[0].path
    }
    
    if(req.files && Array.isArray(req.files.videoFile)&& req.files.videoFile.length>0){
        videofilelocalpath= req.files.videoFile[0].path
    }
    //console.log(thumbnaillocalpath,videofilelocalpath);
    
    if(!thumbnaillocalpath |!videofilelocalpath) return new ApiError(500, 'Something went wrong while uploading files to local path')

        const thumbnailpath= await fileupload(thumbnaillocalpath);
        const videopath= await fileupload(videofilelocalpath);

        if(!thumbnailpath|| !videopath) throw new ApiError(500, 'Error while uploading files to cloudinary')

    const video = await Video.create(
        
    {
        videoFile: videopath.url,
        thumbnail: thumbnailpath.url,
        owner : req.user._id,
        title: title,
        description: description,
        isPublished: true,
    }
    )

    return res.status(200).json(new ApiResponse(200, video, 'Video published succesfully'))
})

// fetch all videos 
const getAllvideos= AsyncHandler(async(req,res)=>{
    const data = await Video.find({
        published: true
    })
    
    if(!data) throw new ApiError(500, 'Something went wrong')

        return(res.status(200).json(
            new ApiResponse(200,data, 'Video data fetched succesfully')
        ))
    
})

// get video by id 
const getVideoById = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    const data = await Video.find({
        _id: videoId
    })
    if(!data) throw new ApiError(400, 'invalid video id')    
    return(res.status(200).json(
        new ApiResponse(200,data, 'Video data fetched succesfully')
    ))
})

// update video details
const updateVideoDetails = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    //console.log(videoId);
    
    const{title, description}= req.body

    let thumbnaillocalpath;
    let thumbnailpath
    if(req.files && Array.isArray(req.files.thumbnail)&& req.files.thumbnail.length>0){
        thumbnaillocalpath= req.files.thumbnail[0].path
        thumbnailpath=  fileupload(thumbnaillocalpath)
    }

    if(!title && !description && !thumbnaillocalpath) return new ApiError(400, 'Alteast one field is required')
    
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(400, 'Invalid video Id')
        
    if(video.owner.toString()!== req.user._id.toString()) throw new ApiError(401, 'Unautherised Request')

        if(title) video.title= title
        if(description) video.description= description
        if(thumbnaillocalpath) video.thumbnail= thumbnailpath

        video.save({validateBeforeSave: false})
    
        return res.status(200).json( 
            new ApiResponse(200, video, 'Details updated succesfully')
        )

})

// delete video

const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(400, 'Invalid video Id')
        
    if(video.owner.toString()!== req.user._id.toString()) throw new ApiError(401, 'Unautherised Request')

        await Video.deleteOne({
            _id: videoId
        })

        return res.status(200).json(
            new ApiResponse(200, ' Video deleted successfully')
        )

})

// toggle publish
const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate videoId
    if (!videoId) throw new ApiError(400, 'Video ID is required');

    // Find the video
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, 'Video not found');

    // Check ownership or required permissions
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Unauthorized request');
    }

    // Toggle the publish status
    video.published = !video.published;

    // Save the updated video
    await video.save({validateBeforeSave: false});

    return res.status(200).json(
        new ApiResponse(200, video, `Video ${video.published ? 'published' : 'unpublished'} successfully`)
    );
});


export {
    publishvideo,
    getAllvideos,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}