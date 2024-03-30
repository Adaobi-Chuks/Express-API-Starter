import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CONSTANTS from "../configs/constants.config";
import UserService from "../services/user.service";
import AuthRequest from "../interfaces/auth.interface";
import CustomResponse from "../utils/response.util";
const {
    findById
} = new UserService();
const {
    TOKEN_ERROR,
    INVALID_TOKEN
} = CONSTANTS.MESSAGES.AUTH;
const {
    INVALID_ID,
    UNEXPECTED_ERROR
} = CONSTANTS.MESSAGES;


// check jwt exists & is valid
export default function authenticate(req: Request, res: Response, next: NextFunction){
    try {
        const tokenHeader = req.headers['authorization'] || req.cookies.token;
        if (!tokenHeader) {
            throw new Error(TOKEN_ERROR);
        }

        const tokenParts = tokenHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            throw new Error(INVALID_TOKEN);
        }

        const token = tokenParts[1];
        jwt.verify(token, CONSTANTS.JWT_SECRET, async (err: any, decoded: any) => {
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
                return new CustomResponse(409, false, INVALID_ID, res);
            }
        }
        return new CustomResponse(500, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
    }
}