import { Router, Request, Response, Application } from 'express';
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { BASEPATH } from '../configs/constants.config';
import { OK } from '../utils/statusCodes.util';
const router: Router = Router();

/**API base route */
router.get("/", (req: Request, res: Response) => {
    res.status(OK).json({
        message: "Welcome to Express API Starter ensure to go through the API docs before using this service"
    })
});

router.use("/users", userRoute);
router.use("/auth", authRoute);

export default (app: Application) => {
    app.get("/", (_req: Request, res: Response) => {
        res.redirect(`${BASEPATH}`);
    });
};