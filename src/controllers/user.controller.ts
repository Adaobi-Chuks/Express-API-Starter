import UserService from "../services/user.service";
import { Request, Response } from "express";
import CustomResponse from "../utils/response.util";
import { MESSAGES } from "../configs/constants.config";
import { CONFLICT, INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
const {
    findById,
    validateId
} = new UserService();
const {
    FETCHED
} = MESSAGES.USER;
const {
    INVALID_ID,
    NOT_ID,
    UNEXPECTED_ERROR
} = MESSAGES;

export default class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const _id = req.params.id;
            await validateId(_id);
            const user = await findById(_id);
            const { id, username} = user
            return new CustomResponse(OK, true, FETCHED, res , { id, username });
        } catch(error) {
            if(error instanceof Error) {
                if (error.message === NOT_ID) {
                    return new CustomResponse(CONFLICT, false, NOT_ID, res);
                } else if (error.message === INVALID_ID) {
                    return new CustomResponse(CONFLICT, false, INVALID_ID, res);
                }
            } else {
                return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
            }
        }
    }
}