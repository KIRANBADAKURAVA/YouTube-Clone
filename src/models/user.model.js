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
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },

    password:{
        type: String,
        required: true,
        unique: true,
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
            type: mongoose.Schema.Types.ObjectId,

            ref: 'video'
        }
    ],

    refreshToken:{
        type: String
    }
    
},{timestamps:true})

//password encryption
userschema.pre('save',async function (next){
    if(!this.isModified('password')) return next();  // functions calls only if password is modified

    const encryptedpassword = await bcrypt.hash(this.password,10)
    //console.log(encryptedpassword);
    this.password=encryptedpassword
    

    next()
})


//password check

userschema.methods.isPasswordCorrect = async function(password){
    //console.log(password, this.password);
    
    return await bcrypt.compare(password,this.password)
}


userschema.methods.Generate_Accesstoken=function(){
   const accessToken = jwt.sign(
        {
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)

return accessToken
}

userschema.methods.Generate_Refreshtoken=function(){
    const refreshToken= jwt.sign(
        {
        _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
    return refreshToken
}









export const User= mongoose.model('User',userschema)  // in database- user (all small)