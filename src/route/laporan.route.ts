import { Router } from "express";
import {
  createLaporan,
  deleteLaporan,
  getLaporanById,
  getLaporans,
  updateLaporan,
} from "../controller/laporan.controller";
import authMiddleware from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

router.get("/laporans", authMiddleware, getLaporans);
router.post(
  "/laporans/create",
  [authMiddleware, upload.single("photo")],
  createLaporan
);
router.get("/laporans/:id", authMiddleware, getLaporanById);
router.put("/laporans/update/:id", authMiddleware, updateLaporan);
router.delete("/laporans/delete/:id", authMiddleware, deleteLaporan);

export default router;
