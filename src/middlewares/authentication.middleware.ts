import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserService from "../services/user.service";
import AuthRequest from "../interfaces/auth.interface";
import CustomResponse from "../utils/helpers/response.util";
import { JWT_SECRET, MESSAGES } from "../configs/constants.config";
import { CONFLICT, INTERNAL_SERVER_ERROR } from "../utils/statusCodes.util";
import { TWO, ZERO } from "../utils/constants.util";
const {
    findById
} = new UserService();
const {
    TOKEN_ERROR,
    INVALID_TOKEN
} = MESSAGES.AUTH;
const {
    INVALID_ID,
    UNEXPECTED_ERROR
} = MESSAGES;


// check jwt exists & is valid
export default function authenticate(req: Request, res: Response, next: NextFunction){
    try {
        const tokenHeader = req.headers['authorization'] || req.cookies.token;
        if (!tokenHeader) {
            throw new Error(TOKEN_ERROR);
        }

        const tokenParts = tokenHeader.split(' ');
        if (tokenParts.length !== TWO || tokenParts[ZERO] !== 'Bearer') {
            throw new Error(INVALID_TOKEN);
        }

        const token = tokenParts[1];
        jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
            if (err) {
                throw new Error(INVALID_TOKEN);
            } else {
                console.log(decoded)
                const authenticatedUser = await findById(decoded.id);
                (req as AuthRequest).user = authenticatedUser;
                next();
            }
        });
    } catch(error) {
        if(error instanceof Error) {
            if (error.message === INVALID_ID) {
                return new CustomResponse(CONFLICT, false, INVALID_ID, res);
            }
        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
    }
}