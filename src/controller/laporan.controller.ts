import dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { laporanSchema } from "../db/schema/laporan";
import db from "../db/connection";
import { eq } from "drizzle-orm";
import { usersSchema } from "../db/schema/user";

dotenv.config();

// Get all laporans
export const getLaporans = async (req: Request, res: Response) => {
  try {
    const laporans = await db.select().from(laporanSchema).execute();
    return res.status(200).json({
      status: "success",
      data: laporans,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get laporan by id
export const getLaporanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laporanId = Number(id);

    const laporan = await db
      .select()
      .from(laporanSchema)
      .where(eq(laporanSchema.id, laporanId))
      .execute();

    res.status(200).json({
      status: "success",
      data: laporan,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create laporan
export const createLaporan = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const photo_url = req.file ? req.file.path : null;
    const user_id = req.user.id;

    await db
      .insert(laporanSchema)
      .values({
        title,
        description,
        status,
        photo_url,
        user_id,
      })
      .execute();

    res.status(201).json({
      status: "success",
      data: {
        title,
        description,
        status,
        photo_url,
        user_id,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
