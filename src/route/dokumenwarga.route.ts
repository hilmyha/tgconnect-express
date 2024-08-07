import { Router } from "express";
import {
  getDokumenWargas,
  getDokumenWargaById,
  createDokumenWarga,
} from "../controller/dokumenwarga.controller";
import authMiddleware from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

router.get("/dokumenwargas", authMiddleware, getDokumenWargas);
router.post(
  "/dokumenwargas/create",
  [authMiddleware, upload.single("dokumen")],
  createDokumenWarga
);
router.get("/dokumenwargas/:id", authMiddleware, getDokumenWargaById);

export default router;