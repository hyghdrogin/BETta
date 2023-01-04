import { Router } from "express";
import UserController from "../controllers/user";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";
import parser from "../middlewares/upload";
import {
  validateSignup, validateLogin, validateUpdate
} from "../validations/users";

const router = Router();

const { verifyToken } = Authentication;
const {
  createUser, verifyAccount, login, getProfile, updateProfile, recover, reset, uploadProfilePicture, deactivateUser, reactivateUser, welcomeBack
} = UserController;

router.post("/create", validator(validateSignup), createUser);
router.post("/verify", verifyAccount);
router.post("/login", validator(validateLogin), login);
router.post("/reactivation", welcomeBack);
router.post("/reactivate", reactivateUser);

router.get("/profile", verifyToken, getProfile);
router.get("/deactivate", verifyToken, deactivateUser);

router.patch("/update", validator(validateUpdate), verifyToken, updateProfile);
router.patch("/recover", recover);
router.patch("/reset", reset);
router.patch("/picture", verifyToken, parser.single("image"), uploadProfilePicture);

export default router;
