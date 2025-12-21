import { Router } from "express";
import authRoutes from "./auth.js";
import replRoutes from "./repl.js";
import { checkUser } from "../middleware/middleware.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/repl", checkUser, replRoutes);
export default router;
