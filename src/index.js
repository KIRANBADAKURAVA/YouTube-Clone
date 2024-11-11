import connectDB from "./db/indexdb.js";
import dotenv from 'dotenv'

dotenv.config({
    path: './env'
})
connectDB();