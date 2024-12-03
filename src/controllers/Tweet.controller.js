import {AsyncHandler} from "../utils/AsyncHandler.js";
import {ApiError}  from '../utils/ApiError.js'
import {Tweet} from '../models/tweet.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from "../models/user.model.js";

const createTweet = AsyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, 'Content is required');
    }

    const newTweet = await Tweet.create({
        content,
        owner: req.user._id, 
    });

    res.status(201).json(
        new ApiResponse(201, newTweet, 'Tweet created successfully')
    );
});

const getUserTweets = AsyncHandler(async (req, res) => {
    
    const { userId } = req.params;

   

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, tweets, 'User tweets retrieved successfully')
    );
});

const updateTweet = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, 'Content is required for update');
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Unauthorized to update this tweet');
    }

    tweet.content = content;
    await tweet.save({ validateBeforeSave: false});

    res.status(200).json(
        new ApiResponse(200, tweet, 'Tweet updated successfully')
    );
});

const deleteTweet = AsyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Unauthorized to delete this tweet');
    }

     await tweet.deleteOne();;

    res.status(200).json(
        new ApiResponse(200, null, 'Tweet deleted successfully')
    );
});


export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}