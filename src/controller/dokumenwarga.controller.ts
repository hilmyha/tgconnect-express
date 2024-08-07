import dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { dokumenwargaSchema } from "../db/schema/dokumenwarga";
import db from "../db/connection";
import { eq, sql } from "drizzle-orm";
import { usersSchema } from "../db/schema/user";

dotenv.config();

// Get all dokumenwargas
export const getDokumenWargas = async (req: Request, res: Response) => {
  try {
    const dokumenwargas = await db.select().from(dokumenwargaSchema).execute();
    return res.status(200).json({
      status: "success",
      data: dokumenwargas,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get dokumenwarga by id
export const getDokumenWargaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dokumenWargaId = Number(id);

    const dokumenwarga = await db
      .select()
      .from(dokumenwargaSchema)
      .where(eq(dokumenwargaSchema.id, dokumenWargaId))
      .leftJoin(usersSchema, eq(dokumenwargaSchema.user_id, usersSchema.id))
      .execute();

    // check if id did not exist
    if (dokumenwarga.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Dokumen Warga not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: dokumenwarga,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create dokumenwarga
export const createDokumenWarga = async (req: Request, res: Response) => {
  try {
    const { status, description } = req.body;
    const dokumen_url = req.file ? req.file.path : null;
    const user_id = req.user.id;

    await db
      .insert(dokumenwargaSchema)
      .values({
        dokumen_url,
        description,
        status,
        user_id,
      })
      .execute();

    res.status(201).json({
      status: "success",
      data: {
        dokumen_url,
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

// Update dokumenwarga
export const updateDokumenWarga = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dokumenWargaId = Number(id);
    const { status, description } = req.body;

    await db
      .update(dokumenwargaSchema)
      .set({
        status,
        description,

        // update timestamp
        updated_at: sql`now()`,
      })
      .where(eq(dokumenwargaSchema.id, dokumenWargaId))
      .execute();

    res.status(200).json({
      status: "success",
      message: "Dokumen Warga updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete dokumenwarga
export const deleteDokumenWarga = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dokumenWargaId = Number(id);

    await db
      .delete(dokumenwargaSchema)
      .where(eq(dokumenwargaSchema.id, dokumenWargaId))
      .execute();

    res.status(200).json({
      status: "success",
      message: "Dokumen Warga deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
