import {Request, Response, NextFunction } from "express";
import logger from "./logger.middleware";
import { INTERNAL_SERVER_ERROR } from "../utils/statusCodes.util";

export default  (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error);

  return res.status(INTERNAL_SERVER_ERROR).send({
    success: false,
    message: error.message
  });
};