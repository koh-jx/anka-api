import * as mongoose from 'mongoose';


export interface UserDocument extends mongoose.Document {
    userId: number;
    username: string;
    password: string;
}
