import mongoose from "mongoose";
import IUser from "../interfaces/user.interface";
import User from "../models/user.model";

export default class UserRepository {
    async create(user: IUser) {
        const createdUser = await User.create(user);
        return await User.findOne({ _id: createdUser.id});
    }

    async findOne(param: {}) {
        return await User.findOne(param);
    }

    async validateId(id: string) {
        if (mongoose.Types.ObjectId.isValid(id)) {
            return true;
        }
    }
}