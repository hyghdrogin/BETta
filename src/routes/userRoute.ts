import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/auth";
import parser from "../middlewares/upload";

const router = Router();

const { verifyToken } = Authentication;
const {
  createUser, verifyAccount, login, getProfile, updateProfile, recover, reset, uploadProfilePicture, deleteUser, deactivateUser
} = UserController;

router.post("/create", createUser);
router.post("/login", login);

router.get("/profile", verifyToken, getProfile);

router.patch("/deactivate/:userId", verifyToken, deactivateUser);

router.patch("/update", verifyToken, updateProfile);
router.patch("/verify", verifyAccount);
router.patch("/recover-account", recover);
router.patch("/reset-password", reset);
router.patch("/profile-picture", verifyToken, parser.single("image"), uploadProfilePicture);

router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
