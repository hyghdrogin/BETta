import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/auth";

const router = Router();

const { verifyToken } = Authentication;
const { createUser, login, updateProfile } = UserController;

router.post("/create", createUser);
router.post("/login", login);
router.post("/profile-update", verifyToken, updateProfile);

export default router;
