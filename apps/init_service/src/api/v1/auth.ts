import { Router } from "express";
import { User } from "../controllers/user.js";
const router = Router();

router.post("/signup", User.signup);
router.post("/login", User.login);
router.post("/signupwithgoogle", User.signUpWithGoogle);
export default router;
