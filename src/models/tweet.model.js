import mongoose, { Schema } from 'mongoose'

const tweetSchema = mongoose.Schema({

        owner:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        content:{
            type: string
        }

},
{
    timestamps: true
})

export const Video= mongoose.model('Video', tweetSchema)