import jwt from 'jsonwebtoken'
import { AsyncHandler } from '../utils/Asynchandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'

export  const Tokenverification = AsyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(400,'Invalid access token')
    }

   try {
   
     const decodeToken=  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

     const user= await User.findById(decodeToken._id).select('-password -refreshToken')
     if(!user){
        throw new ApiError(400,'Invalid access token')
     }

     req.user=user
     next()

   } catch (error) {
    throw new ApiError(400,error.message)
}
    
   

})