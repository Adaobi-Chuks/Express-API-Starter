import { JWT_SECRET, MAXAGE, MESSAGES } from "../configs/constants.config";
import IUser from "../interfaces/user.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import BaseRepository from "../repositories/base.repository";
import User from "../models/user.model";
import HttpException from "../utils/helpers/httpException.util";
import { CONFLICT, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../utils/statusCodes.util";
const { create, findOne, findById, find, validateId } = new BaseRepository(
    User
);
const { INVALID_USER, DUPLICATE_EMAIL, DUPLICATE_USERNAME } = MESSAGES.USER;
const { NOT_ID, INVALID_ID } = MESSAGES;

export default class UserService {

    async create(user: IUser) {
        try {

            return await create(user);

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async validateEmail(email: string) {
        try {

            if (await findOne({ email })) throw new HttpException(CONFLICT, DUPLICATE_EMAIL);

            return true;

        } catch (error: any) {

            if (error.status === CONFLICT) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async validateUsername(username: string) {
        try {

            if (await findOne({ username })) throw new HttpException(CONFLICT, DUPLICATE_USERNAME);

            return true;

        } catch (error: any) {

            if (error.status === CONFLICT) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findByUsername(username: string) {
        try {

            const user = await findOne({ username });

            if (!user) throw new HttpException(NOT_FOUND, INVALID_USER);

            return user;

        } catch (error: any) {

            if (error.status === NOT_FOUND) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findById(id: string) {
        try {

            const user = await findById(id);

            if (!user) throw new HttpException(NOT_FOUND, INVALID_ID);

            return user;

        } catch (error: any) {

            if (error.status === NOT_FOUND) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findAll() {
        try {

            return await find();

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async validateId(id: string) {
        try {

            if (!(await validateId(id))) throw new HttpException(FORBIDDEN, NOT_ID);

            return true;

        } catch (error: any) {

            if (error.status === FORBIDDEN) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async validatePassword(password: string, user: IUser) {
        try {

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) throw new HttpException(UNAUTHORIZED, INVALID_USER);

            return true;

        } catch (error: any) {

            if (error.status === UNAUTHORIZED) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    generateAuthToken(user: IUser) {
        try {

            return jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                JWT_SECRET,
                {
                    expiresIn: MAXAGE,
                }
            );

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
