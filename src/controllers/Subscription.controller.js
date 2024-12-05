import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Subscription} from "../models/subscription.model.js"

// toggles subscription
const toggleSubscription = AsyncHandler(async (req, res) => {
   const userId= req.user._id
   const {channelId}= req.params
   // console.log(userId, channelId);

    if (!userId) throw new ApiError(400, 'Unathorized error')
    
    const channel= await User.findById( channelId)

    if(!channel) throw new ApiError(400, 'Channel does not exist')

   var subcription= await Subscription.find({
    channel: channelId,
    subscriber: userId
   })
   let message; 
   if(!subcription.length){

    subcription = await Subscription.create({
        channel: channelId,
        subscriber: userId
    })
    
    if (!subcription) {
        throw new ApiError(500, 'Something went wrong while creating subscription')
    }
    message= 'Subscription added succesfully'
   }else{
    await Subscription.deleteOne({
        channel: channelId,
        subscriber: userId
    })
    message= 'Subscription Removed succesfully'
   }
   
 return (res.status(200).json( new ApiResponse(200, subcription, message)))
});

// gives subscribers list
const getUserChannelSubscribers = AsyncHandler(async (req, res) => {
    const {channelId} = req.params
    //console.log(channelId);
    
    const channel= await User.findById(channelId)

    if(!channel) throw new ApiError(400, 'Channel does not exist')

    const channeldetails = await Subscription.find({
        channel: channelId
    })
    
    if(!channeldetails) {
        return res.status(200).json(new ApiResponse(200,[],'Channel does not have any subscribers'))
    }

    return res.status(200).json(new ApiResponse(200,channeldetails,'Channel details fetched successfully'))
    

})

// gives subscribed channel list
const getSubscribedChannels = AsyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    //console.log(channelId);
    
    const subscriber= await User.findById(subscriberId)

    if(!subscriber) throw new ApiError(400, 'User does not exist')

    const subscriberdetails = await Subscription.find({
        subscriber: subscriberId
    })
    
    if(!subscriberdetails) {
        return res.status(200).json(new ApiResponse(200,[],'User did not subscribe to any channel'))
    }

    return res.status(200).json(new ApiResponse(200,subscriberdetails,'Channel details fetched successfully'))
    

})

export{
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}