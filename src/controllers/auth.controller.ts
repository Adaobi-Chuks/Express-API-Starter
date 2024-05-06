import { Request, Response } from "express";

import UserService from "../services/user.service";
import CustomResponse from "../utils/helpers/response.util";
import { MAXAGE, MESSAGES } from "../configs/constants.config";
import { ADDED, INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
import { THOUSAND } from "../utils/constants.util";
import HttpException from "../utils/helpers/httpException.util";

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

            const { _id, email } = user!

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: MAXAGE * THOUSAND
            });

            return new CustomResponse(ADDED, true, CREATED, res, { _id, email, token });

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
        }
    }

    async login(req: Request, res: Response) {

        try {

            const data = req.body

            const user = await findByUsername(data.username);

            await validatePassword(data.password, user!);

            const token = generateAuthToken(user as any);

            const { id, email } = user!

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: MAXAGE * THOUSAND
            });

            return new CustomResponse(OK, true, LOGGEDIN, res, { id, email, token });

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
        }
    }
}