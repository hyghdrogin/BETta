import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/auth";

const router = Router();

const { verifyToken } = Authentication;
const {
  createUser, verifyAccount, login, getProfile, updateProfile, recover, reset
} = UserController;

router.post("/create", createUser);
router.post("/login", login);

router.get("/profile", verifyToken, getProfile);

router.patch("/update", verifyToken, updateProfile);
router.patch("/verify", verifyAccount);
router.patch("/recover-account", recover);
router.patch("/reset-password", reset);

export default router;
