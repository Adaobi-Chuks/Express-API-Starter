import { JWT_SECRET, MAXAGE, MESSAGES } from "../configs/constants.config";
import IUser from "../interfaces/user.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import BaseRepository from "../repositories/base.repository";
import User from "../models/user.model";
const {
    create,
    findOne,
    findById,
    find,
    validateId
} = new BaseRepository(User);
const {
    INVALID_USER,
    DUPLICATE_EMAIL,
    DUPLICATE_USERNAME
} = MESSAGES.USER;
const {
    NOT_ID,
    INVALID_ID
} = MESSAGES;

export default class UserService {
    async create(user: IUser) {
        return await create(user);
    }

    async validateEmail(email: string) {
        if (await findOne({email})) {
            throw new Error(DUPLICATE_EMAIL);
        }
    }

    async validateUsername(username: string) {
        if (await findOne({username})) {
            throw new Error(DUPLICATE_USERNAME);
        }
    }

    async findByUsername(username: string) {
        const user = await findOne({username});
        if (!user) {
            throw new Error(INVALID_USER);
        }
        return user;
    }

    async findById(id: string) {
        const user = await findById(id)
        if (!user) {
            throw new Error(INVALID_ID);
        } 
        return user;
    }
    
    async findAll() {
        return await find();
    }
    
    async validateId(id: string) {
        if (!await validateId(id)) {
            throw new Error(NOT_ID);
        }
    }
    
    async validatePassword(password: string, user: IUser) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error(INVALID_USER);
        }
    }

    generateAuthToken (user: IUser) {
        return jwt.sign({
            id: user._id,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: MAXAGE
        });
    }
}