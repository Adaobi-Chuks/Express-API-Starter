import UserService from "../services/user.service";
import CONSTANTS from "../configs/constants.config";
import { Request, Response } from "express";
import CustomResponse from "../utils/response.util";
const {
    findById,
    validateId
} = new UserService();
const {
    FETCHED
} = CONSTANTS.MESSAGES.USER;
const {
    INVALID_ID,
    NOT_ID,
    UNEXPECTED_ERROR
} = CONSTANTS.MESSAGES;

export default class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const _id = req.params.id;
            await validateId(_id);
            const user = await findById(_id);
            const { id, username} = user
            return new CustomResponse(200, true, FETCHED, res , { id, username });
        } catch(error) {
            if(error instanceof Error) {
                if (error.message === NOT_ID) {
                    return new CustomResponse(409, false, NOT_ID, res);
                } else if (error.message === INVALID_ID) {
                    return new CustomResponse(409, false, INVALID_ID, res);
                }
            } else {
                return new CustomResponse(500, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
            }
        }
    }
}