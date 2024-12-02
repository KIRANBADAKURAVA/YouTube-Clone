import {AsyncHandler} from "../utils/Asynchandler.js";
import {ApiError}  from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import fileupload from '../utils/cloudinary.utils.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import mongoose from "mongoose";


// User registration
const registeruser= AsyncHandler(async (req, res)=>{

     //console.log(req.body);
    

     // get user details from frontend
     const {username, email, password, fullName} =  req.body
 
    //  res.status(200).json({
    //      message: username
    //  })
     // validation - not empty
    if(
        [username,email, password, fullName].some((item)=>item?.trim()==="")
    ){
        throw new ApiError(400, 'All fields are required')
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
        //console.log(req.files);
        //console.log(req.files.coverimage);
        
      let avatarpath;
      //const coverimpath= req.files?.coverimage[0]?.path 
      let coverimpath;

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatarpath= req.files.avatar[0].path 
    }
    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
        coverimpath= req.files.coverimage[0].path 
    }
    //console.log(coverimpath);
    
      if(!avatarpath){
        throw new ApiError(400, 'Avatar is required')
      }

    // upload them to cloudinary, avatar
      const avatarupload= await fileupload(avatarpath)
      const coverImage = await fileupload(coverimpath)
      

      // recheck if its uploaded
      if(!avatarupload){
        throw new ApiError(409, 'Avatar is required')
      }

       // create user object - create entry in db
       //console.log(username);
       
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


// Method for accesstoken and refresh token generation 
const AccessandRefreshTokenGenerater= async(userid)=>{
      
  const user = await User.findById(userid)
 
  
  const accessToken =  user.Generate_Accesstoken() 
  const refreshToken =  user.Generate_Refreshtoken()
  
  user.refreshToken= refreshToken
  await user.save({ validateBeforeSave: false })
  //console.log(refreshToken,accessToken);
  
  //console.log(await User.findById(userid));
  
  return {accessToken,refreshToken}
}


// Login 
const loginuser= AsyncHandler(async (req, res)=>{

    // ***req body -> data***
     const { username,email, password}= req.body
      //console.log(req.body);
      //console.log(email,password);
      
    // ***username or email***
    if(!username && !email){
      throw new ApiError(400, 'Any one field is required ')
    }

    // ***find the user***
    const user= await User.findOne({
      $or: [{username},{email}]
    })
    
    if(!user)  throw new ApiError(404, "User does not exist")
   
    
    
    // ***password check***
    const boolpassword = await user.isPasswordCorrect(password)
    
    //console.log(boolpassword);
    
    if(!boolpassword) {
      throw new ApiError(401,'Invalid Username or Password')
    }

    //***access and referesh token***
    const {accessToken,refreshToken}= await AccessandRefreshTokenGenerater(user._id)
    //console.log(accessToken,refreshToken);
    
    if(!accessToken || !refreshToken){
      throw new ApiError(500, 'Error in token generation')
    }
    //console.log(user);
    const loggeduser= await User.findById(user._id).select('-password -refreshToken')
    
    //***send cookie***
    
    const options={
      httpOnly: true,
      secure: true
    }

    return res.cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options)
              .json( 
                new ApiResponse(200,
                  {
                    user : {loggeduser, refreshToken, accessToken}
                  },
                  'User logged succesfully'
                )
              )

})


//logout user
const Logoutuser= AsyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset : {
        refreshToken: 1 // this removes the field from document
    }
  }
)
const options={
  httpOnly: true,
  secure: true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged Out"))
})


//  Get current User
const getCurrentUser= AsyncHandler(async (req,res)=>{
//console.log(req.user._id);

  
  
  return res.status(201).json(
    new ApiResponse(200, req.user, "User data fetched Successfully"))
})

 //  ------ Update controllers----  


 // Change Password 
 const updatePassword= AsyncHandler(async (req,res)=>{
      const {oldPassword, newPassword}= req.body
  
  const user= await User.findById(req.user._id)
  if(!user){
     throw new ApiError(500, 'Something went wrong')
  }
  //console.log(req.body);
     const boolpassword = user.isPasswordCorrect(oldPassword)
     if(!boolpassword){
      throw new ApiError(400, 'Incorrect Password')
     }
     user.password = newPassword;
     await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200,  user,'Password updated successfully '))
 })


// Update Account Details 
const updateAccountDetails= AsyncHandler(async(req,res)=>{

  const {username, fullName} = req.body

  if(!username && !fullName) return new ApiError(400, 'Atleast one Field is required')

    const user= await User.findById(req.user._id).select('-password')

    if (!user) return new ApiError(500,'Something went wrong ')

    if(username) user.username=username
    if(fullName) user.fullName=fullName

    user.save({validateBeforeSave: false})
    return res.status(200).json(
      new ApiResponse(200, user,'Profile Updated successfully')
    )
})


// Update Avatar
const updateAvatar = AsyncHandler(async (req, res)=>{

  const avatarlocalpath= req.file?.path

  if(!avatarlocalpath) return new ApiError(400, 'error in uploading avatar to local path ')

    const avatar= fileupload(avatarlocalpath)

    if(!avatar) return new ApiError(500, 'error in uploading avatar to cloudinary')

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set :{
            avatar : avatar.url
          }
        },
        {
          new:true
        }
      ).select('-password')

      if(!user) return new ApiError(500, 'Something went wrong in finding user ')

    return res.status(200).json(new ApiResponse(200,user,' Avatar updated succesfully'))
})

// Todo delete old one from cloudinary

// Update Cover Image
const updateCover = AsyncHandler(async (req, res)=>{

  const coverlocalpath= req.file?.path

  if(!coverlocalpath) return new ApiError(400, 'error in uploading coverimage to local path ')

    const coverimage= fileupload(coverlocalpath)

    if(!cover) return new ApiError(500, 'error in uploading coverimage to cloudinary')

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set :{
            coverimage : coverimage.url
          }
        },
        {
          new:true
        }
      ).select('-password')

      if(!user) return new ApiError(500, 'Something went wrong in finding user ')

    return res.status(200).json(new ApiResponse(200,user,' Cover inmage updated succesfully'))
})

// --- Aggregate piplines---

// Channel Details
const getChanneldetails= AsyncHandler( async ( req, res )=>{ 

  const username= req.params
  if(!username) return new ApiError(400, 'Cannot find channel')

    const channel = await User.aggregate([
      {
        $match : {
          username : username.toLowerCase()
        }
      },
      // pipeline for Array of subscribers
      {
        $lookup :{
          from: 'subscribers',
          localField: "_id",
          foreignField:"subscriber",
          as: 'Subscribers'

        }
      },
      // pipeline from array of Subsribed channels
      {
        $lookup:{
          from: 'subscribers',
          localField: "_id",
          foreignField:"channel",
          as: 'SubscribedTo'
        }
      },
      {
        $addFields:{
          subcribersCount: { $size : "$Subscribers"},
          subcribedCount: { $size : "$SubscribedTo"},
          isSubscribed :{
            $cond :{
              $if : { $in : [req.user?._id, 'Subscribers']},
                then: true,
                else: false
              
            }
          }
        }
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          subcribedCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1
      }
      }

    ])

    if(!channel.length) return new ApiError(400, 'Error in fetching channel data')

      return res.status(200).json(new ApiResponse(200, channel[0], 'Channel data fetched successfully'))

 } )

// Current user watch history
const getWatchHistory= AsyncHandler(async ( req, res )=>{

  const user= await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id) 
    }
  },
  {
    $lookup :{
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as : 'watchHistory',
              pipeline: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as:'owner',
                      pipeline :{
                      $project:{
                        _id:1,
                        email:1,
                        username:1,
                        avatar:1
                      
                      }
                }
              }
    } 
  },
  {
    $addFields:{
      owner:{
         $first: "$owner"
      }
    }
  }
  ])

  if(!user) return new ApiError(500, 'something went wrong while fetching watch histry')

    return res.status(200).json(new ApiResponse(200,user[0].watchHisory,'Watch histry fetched successfully' ))
})



export {
    registeruser,
    loginuser,
    Logoutuser,
    updatePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCover,
    getChanneldetails,
    getWatchHistory
}






