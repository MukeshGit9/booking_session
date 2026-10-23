import mongoose from 'mongoose';
import { MONGO_URL } from '../../env.js';

export default async function connectionDb():Promise<void>{
    try {
        if(!MONGO_URL){
            console.error("Mongodb url is not configured");
        }
        await mongoose.connect(MONGO_URL);
        console.log("Successfully Connected to Database")
    } catch (error) {
        console.error("Mongodb connection failed : ", error);
        process.exit(1)
    }
}