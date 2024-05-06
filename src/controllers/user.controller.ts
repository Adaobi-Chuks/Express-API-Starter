import UserService from "../services/user.service";
import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import { MESSAGES } from "../configs/constants.config";
import { INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
const {
    findById,
    validateId
} = new UserService();
const {
    FETCHED
} = MESSAGES.USER;
const {
    UNEXPECTED_ERROR
} = MESSAGES;

export default class UserController {

    async getUser(req: Request, res: Response) {

        try {

            const _id = req.params.id;

            await validateId(_id);

            const user = await findById(_id);

            const { id, username } = user

            return new CustomResponse(OK, true, FETCHED, res, { id, username });

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }
}