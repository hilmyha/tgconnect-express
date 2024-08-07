import dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { laporanSchema } from "../db/schema/laporan";
import db from "../db/connection";
import { eq, sql } from "drizzle-orm";
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

    // check if id did not exist
    if (laporan.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Laporan not found",
      });
    }

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

// Update laporan
export const updateLaporan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laporanId = Number(id);
    const { title, description, status } = req.body;

    await db
      .update(laporanSchema)
      .set({
        title,
        description,
        status,

        // update timestamp
        updated_at: sql`now()`,
      })
      .where(eq(laporanSchema.id, laporanId))
      .execute();

    res.status(200).json({
      status: "success",
      message: "Laporan updated successfully",
      data: {
        title,
        description,
        status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete laporan
export const deleteLaporan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const laporanId = Number(id);

    await db.delete(laporanSchema).where(eq(laporanSchema.id, laporanId));

    res.status(200).json({
      status: "success",
      message: "Laporan deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
