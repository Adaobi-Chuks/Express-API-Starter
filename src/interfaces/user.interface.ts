import { Document } from 'mongoose';

export default interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    id: string
}