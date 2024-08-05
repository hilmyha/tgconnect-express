import { Router } from "express";
import { loginUser, refreshToken, registerUser } from "../controller/auth.controller";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

export default router;