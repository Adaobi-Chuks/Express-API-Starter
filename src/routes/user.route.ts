import express from 'express';
import UserController from '../controllers/user.controller';
import authenticate from '../middlewares/authentication.middleware';
const { getUser } = new UserController();
const router = express.Router();

//get a user
router.get("/:id", authenticate, getUser);

export default router;