import { Router } from "express";
import userRoutes from "./userRoute";
import creditRoutes from "./creditRoute";

const router = Router();

router.use("/users", userRoutes);
router.use("/credits", creditRoutes);

export default router;
