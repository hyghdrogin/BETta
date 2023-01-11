import { Router } from "express";
import NotificationController from "../controllers/notification";
import Authentication from "../middlewares/auth";
import validator from "../middlewares/validator";

const router = Router();
const { createNotification} = NotificationController
const { verifyToken} = Authentication

router.post("/create",  createNotification);

export default NotificationController;