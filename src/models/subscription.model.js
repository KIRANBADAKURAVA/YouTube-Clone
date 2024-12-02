import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({ 

    subscriber : {
        type : Schema.Types.ObjectId,
        ref: user
    },
    channel : {
        type : Schema.Types.ObjectId,
        ref: user
    }
 },
{timestamps: true})

export const subscription= mongoose.model('Subscription',subscriptionSchema) // in mongodb Subscription-> subscriptions