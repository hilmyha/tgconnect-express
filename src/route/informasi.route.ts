import { Router } from "express";
import {
  createInformasi,
  deleteInformasi,
  getInformasiById,
  getInformasis,
  updateInformasi,
} from "../controller/informasi.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/informasis", authMiddleware, getInformasis);
router.get("/informasis/:id", authMiddleware, getInformasiById);
router.post("/informasis/create", authMiddleware, createInformasi);
router.put("/informasis/update/:id", authMiddleware, updateInformasi);
router.delete("/informasis/delete/:id", authMiddleware, deleteInformasi);

export default router;
