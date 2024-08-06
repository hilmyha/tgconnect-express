import dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { informasiSchema } from "../db/schema/informasi";
import db from "../db/connection";
import { eq } from "drizzle-orm";

dotenv.config();

// Get all informasis
export const getInformasis = async (req: Request, res: Response) => {
  try {
    const informasis = await db.select().from(informasiSchema).execute();
    return res.status(200).json({
      status: "success",
      data: informasis,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get informasi by id
export const getInformasiById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const informasiId = Number(id);

    const informasi = await db
      .select()
      .from(informasiSchema)
      .where(eq(informasiSchema.id, informasiId))
      .execute();

    // check if id did not exist
    if (informasi.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Informasi not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: informasi,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create informasi
export const createInformasi = async (req: Request, res: Response) => {
  try {
    const { title, description, date, time } = req.body;
    const user_id = req.user.id;

    await db
      .insert(informasiSchema)
      .values({
        title,
        description,
        date,
        time,
        user_id,
      })
      .execute();

    res.status(201).json({
      status: "success",
      message: "Informasi created successfully",
      data: {
        title,
        description,
        date,
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

// Update informasi
export const updateInformasi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const informasiId = Number(id);
    const { title, description, date, time } = req.body;

    await db
      .update(informasiSchema)
      .set({
        title,
        description,
        date,
        time,
      })
      .where(eq(informasiSchema.id, informasiId))
      .execute();

    res.status(200).json({
      status: "success",
      message: "Informasi updated successfully",
      data: {
        title,
        description,
        date,
        time,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete informasi
export const deleteInformasi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const informasiId = Number(id);

    await db
      .delete(informasiSchema)
      .where(eq(informasiSchema.id, informasiId))
      .execute();

    res.status(200).json({
      status: "success",
      message: "Informasi deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
