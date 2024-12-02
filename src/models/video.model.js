import mongoose, { Aggregate, Schema } from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'


const videoschema = new mongoose.Schema({

    videoFile:{
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    views:{
        type: Number,
        default: 0,
        required: true,
    },
    published:{
        type:Boolean,
        default: true,
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },

})


videoschema.plugin(mongooseAggregatePaginate)    // for using mongooseAggregatePaginate queries in videoschema

export const Video= mongoose.model('Video',videoschema)