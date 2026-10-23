import dotenv, { config } from 'dotenv';
dotenv.config();

export const PORT_NO = process.env.PORT || 4000;
export const MONGO_URL = process.env.MONGO_URL as string;