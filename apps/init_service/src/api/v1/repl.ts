import { Router } from "express";
import { Repl } from "../controllers/repl.js";
const router = Router();

router.post("/create", Repl.create);
export default router;
