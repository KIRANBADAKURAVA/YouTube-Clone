import mongoose, { model } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
//Schema 
const userschema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    avatar:{
        type: String,
        required: true,
    },
    coverimage:{
        type: String,
        //required: true,
    },
    watchHistory:[
        {
            type: Object.Schema.type.ObjectId,
            ref: 'video'
        }
    ],

    refreshToken:{
        type: String
    }
    
},{timestamps:true})

//password encryption
userschema.pre('save',async function ncrypt(next){
    if(!this.isModified('password')) return next();  // functions calls only if password is modified

    this.password= bcrypt.hash(this.password,10)
})


//password check

userschema.methods.isPasswordCorrect(async function(password){
    return await bcrypt.compare(this.password,password)
})


userschema.methods.Generate_Accesstoken=function(){
    jwt.sign({
        _id: this.username,
        email: this.email,
        password: this.password,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userschema.methods.Generate_Refreshtoken=function(){
    jwt.sign({
        _id: this.username,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}









export const User= mongoose.model('User',userschema)  // in database- user (all small)