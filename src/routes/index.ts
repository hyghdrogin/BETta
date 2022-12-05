import { Router } from "express";
import userRoutes from "./userRoute";

const router = Router();

router.use("/users", userRoutes);

export default router;
