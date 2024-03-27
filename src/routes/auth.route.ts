import express from 'express';
import AuthController from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { signupSchema, loginSchema } from '../schemas/user.schema';
const router = express.Router();
const { signUp, login } = new AuthController();

//create a user or signup
router.post("/", validate(signupSchema), signUp);

//login a user
router.post("/login", validate(loginSchema), login);

export default router;