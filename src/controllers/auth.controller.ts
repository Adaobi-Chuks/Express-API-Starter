import UserService from "../services/user.service";
import CONSTANTS from "../configs/constants.config";
import { Request, Response } from "express";
import CustomResponse from "../utils/response.util";
const {
    create,
    validateEmail,
    validateUsername,
    findByUsername,
    validatePassword,
    generateAuthToken
} = new UserService();
const {
    CREATED,
    LOGGEDIN,
    DUPLICATE_EMAIL,
    DUPLICATE_USERNAME,
    INVALID_USER,
    UNEXPECTED_ERROR
} = CONSTANTS.MESSAGES.USER;


export default class UserController {
    async signUp(req: Request, res: Response) {
        try {
            const data = req.body;
            await validateEmail(data.email);
            await validateUsername(data.username);
            const user = await create(data);
            const token = generateAuthToken(user as any);
            const {_id, email} = user!
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: CONSTANTS.MAXAGE * 1000
            });
            return new CustomResponse(201, true, CREATED, res, { _id, email, token });
        } catch(error) {
            if (error instanceof Error) {
                if (error.message === DUPLICATE_EMAIL) {
                    return new CustomResponse(409, true, DUPLICATE_EMAIL, res);
                } else if (error.message === DUPLICATE_USERNAME) {
                    return new CustomResponse(409, true, DUPLICATE_USERNAME, res);
                }
            }
            return new CustomResponse(500, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = req.body
            const user = await findByUsername(data.username);
            await validatePassword(data.password, user!);
            const token = generateAuthToken(user as any);
            const {id, email} = user!
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: CONSTANTS.MAXAGE * 1000
            });
            return new CustomResponse(200, true, LOGGEDIN, res, {id, email, token});
        } catch(error) {
            if (error instanceof Error) {
                if (error.message === DUPLICATE_USERNAME) {
                    return new CustomResponse(409, true, DUPLICATE_USERNAME, res);
                } else if (error.message === INVALID_USER) {
                    return new CustomResponse(404, true, INVALID_USER, res);
                }
            }
            return new CustomResponse(500, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }
}