import {Router} from "express"
import { Tokenverification } from "../middlewares/auth.middleware.js"
import { getUserChannelSubscribers, toggleSubscription ,getSubscribedChannels} from "../controllers/Subscription.controller.js"

const SubscriptionRouter= Router()

SubscriptionRouter.route('/toggle-subscription/:channelId').patch(Tokenverification, toggleSubscription)
SubscriptionRouter.route('/getsubscribers/:channelId').get( getUserChannelSubscribers)
SubscriptionRouter.route('/getsubscribedchannel/:subscriberId').get( getSubscribedChannels)

export default SubscriptionRouter