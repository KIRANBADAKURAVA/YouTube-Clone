import {cloudinary as v2} from 'cloudinary'
import fs from 'fs'

   // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret
    
    });
    
   // file upload from localstorage

   const fileupload= async (cloudinaryfilepath)=>{
    if(!cloudinaryfilepath) return null

    const uploadResult = await cloudinary.uploader
       .upload(
          fileupload, {
               resource_type:'auto',
           }
           
       )
       .catch((error) => {
            fs.unlinkSync(cloudinaryfilepath)
           console.log(error);
       });
       console.log(uploadResult);
       
       return uploadResult
   }