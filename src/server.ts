import app from "./app";
import logger from "./middlewares/logger.middleware";
import CONSTANTS from "./configs/constants.config"
import connectToMongo from "./configs/database.config"
const port = CONSTANTS.PORT;

(async () => {
  logger.info(`Attempting to run server on port ${port}`);
  connectToMongo();
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
})();