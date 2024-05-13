import UserService from "../services/user.service";
import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import { MAXAGE, MESSAGES } from "../configs/constants.config";
import { ADDED, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../utils/statusCodes.util";
import { THOUSAND } from "../utils/constants.util";
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
    INVALID_USER
} = MESSAGES.USER;
const {
    UNEXPECTED_ERROR
} = MESSAGES;


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
                maxAge: MAXAGE * THOUSAND
            });
            return new CustomResponse(ADDED, true, CREATED, res, { _id, email, token });
        } catch(error) {
            if (error instanceof Error) {
                if (error.message === DUPLICATE_EMAIL) {
                    return new CustomResponse(CONFLICT, true, DUPLICATE_EMAIL, res);
                } else if (error.message === DUPLICATE_USERNAME) {
                    return new CustomResponse(CONFLICT, true, DUPLICATE_USERNAME, res);
                }
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
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
                maxAge: MAXAGE * THOUSAND
            });
            return new CustomResponse(OK, true, LOGGEDIN, res, {id, email, token});
        } catch(error) {
            if (error instanceof Error) {
                if (error.message === DUPLICATE_USERNAME) {
                    return new CustomResponse(CONFLICT, true, DUPLICATE_USERNAME, res);
                } else if (error.message === INVALID_USER) {
                    return new CustomResponse(NOT_FOUND, true, INVALID_USER, res);
                }
            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }
}