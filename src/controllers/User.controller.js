import {AsyncHandler} from "../utils/Asynchandler.js";
import ApiError  from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { fileupload } from "../utils/cloudinary.utils.js";
import ApiResponse from '../utils/ApiResponse.js'

const registeruser= AsyncHandler(async (req, res)=>{

     // get user details from frontend
     const {username, password, fullname, avatar,coverimage} =  req.body
 
    //  res.status(200).json({
    //      message: username
    //  })
     // validation - not empty
    if(
        [username, password, fullname].some((item)=>item?.trim()==="")
    ){
        throw new ApiError(409, 'All fields are required')
    }


    // check if user already exists: username, email

    const existinguser = User.findOne({
        $or: [{ username, email  }]
    })
    
    if(existinguser){
        throw new ApiError(409,'User alreaduy exists')
    }

      // check for images, check for avatar

      const avatarpath= req.files?.avatar[0]?.path
      const coverimpath= req.files?.path[0]?.path

      if(!avatarpath){
        throw new ApiError(400, 'All fields are required')
      }

    // upload them to cloudinary, avatar
      const avatarupload= await fileupload(avatarpath)
      const coverImage = await uploadOnCloudinary(coverImageLocalPath)
      // recheck if its uploaded
      if(!avatarupload){
        throw new ApiError(400, 'All fields are required')
      }

       // create user object - create entry in db
      const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

     // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

      // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})





export {
    registeruser
}






