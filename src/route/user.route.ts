import { Router } from "express";
import {
  getUserById,
  getUsers,
  updateUser,
} from "../controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/users", authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.put("/users/update/:id", authMiddleware, updateUser);

export default router;
