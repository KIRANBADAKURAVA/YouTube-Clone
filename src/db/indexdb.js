import mongoose from 'mongoose'
import { db_name } from '../constants.js'


const connectDB= async ()=>{
    
        try {
            const connection= await mongoose.connect(`${process.env.MONGODB_URI}${db_name}`)

            console.log('DB connected successfully',connection.connection.host);
            

        } catch (error) {
            console.log('Error in connecting DB' , error);
            process.exit(1)
            
        }

}
export default connectDB