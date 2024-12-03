import {Router} from 'express'
import { Tokenverification } from '../middlewares/auth.middleware.js'
import { createTweet,getUserTweets,updateTweet ,deleteTweet } from '../controllers/Tweet.controller.js'


const TweetRouter= Router()

TweetRouter.route('/createtweet').post(Tokenverification, createTweet);

// Get all tweets for a specific user
TweetRouter.route('/userTweets/:userId').get(Tokenverification, getUserTweets);

// Update an existing tweet
TweetRouter.route('/updateTweet/:tweetId').patch(Tokenverification, updateTweet);

// Delete an existing tweet
TweetRouter.route('/deleteTweet/:tweetId').delete(Tokenverification, deleteTweet);


export default TweetRouter