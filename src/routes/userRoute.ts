import { Router } from "express";
import UserController from "../controllers/user";

const router = Router();

const { createUser, login } = UserController;

router.post("/create", createUser);
router.post("/login", login);

export default router;
