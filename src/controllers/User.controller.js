import {AsyncHandler} from "../utils/Asynchandler.js";
import {ApiError}  from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import fileupload from '../utils/cloudinary.utils.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registeruser= AsyncHandler(async (req, res)=>{

    //console.log(req);
    

     // get user details from frontend
     const {username, email,password, fullName} =  req.body
 
    //  res.status(200).json({
    //      message: username
    //  })
     // validation - not empty
    if(
        [username,email, password, fullName].some((item)=>item?.trim()==="")
    ){
        throw new ApiError(409, 'All fields are required')
    }


    // check if user already exists: username, email

    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    })
    //console.log(existinguser,'here');
    
    if(existinguser){
        throw new ApiError(409,'User alreaduy exists')
    }

      // check for images, check for avatar
        //console.log(req.files.avatar);
        //console.log(req.files.coverimage);
        
      const avatarpath= req.files?.avatar[0]?.path
      //const coverimpath= req.files?.coverimage[0]?.path 
      let coverimpath;

    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
        coverimpath= req.files.coverimage[0].path 
    }
    //console.log(coverimpath);
    
      if(!avatarpath){
        throw new ApiError(400, 'All fields are required')
      }

    // upload them to cloudinary, avatar
      const avatarupload= await fileupload(avatarpath)
      const coverImage = await fileupload(coverimpath)
      

      // recheck if its uploaded
      if(!avatarupload){
        throw new ApiError(400, 'All fields are required')
      }

       // create user object - create entry in db
       console.log(avatarupload);
       
      const user = await User.create({
        fullName,
        avatar: avatarupload.url,
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






