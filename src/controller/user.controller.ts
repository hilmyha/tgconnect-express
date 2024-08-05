import dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { usersSchema } from "../db/schema/user";
import db from "../db/connection";
import { eq, sql } from "drizzle-orm";

dotenv.config();

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(usersSchema).execute();
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    const user = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .execute();

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const {
      username,
      email,
      nama,
      no_handphone,
      jalan,
      blok,
      status_kependudukan,
    } = req.body;

    const user = await db
      .update(usersSchema)
      .set({
        username,
        email,
        nama,
        no_handphone,
        jalan,
        blok,
        status_kependudukan,

        // update timestamp
        updated_at: sql`now()`,
      })
      .where(eq(usersSchema.id, userId))
      .execute();

    res.json({
      status: "success",
      message: "User updated successfully",
      data: {
        username,
        email,
        nama,
        no_handphone,
        jalan,
        blok,
        status_kependudukan,
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
