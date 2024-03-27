import mongoose from "mongoose";
mongoose.set("strictQuery", true);
import CONSTANTS from "./constants.config";
import logger from "../middlewares/logger.middleware";

export default function connectToMongo() {
  mongoose.connect(process.env.DB_URI!)
    .then(() => {
      logger.info(CONSTANTS.MESSAGES.DATABASE.CONNECTED);
    })
    .catch((err) => {
      logger.error(CONSTANTS.MESSAGES.DATABASE.ERROR, err);
    }
  );
}