import dotenv from "dotenv";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

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
      password,
      is_admin,
      nama,
      no_handphone,
      jalan,
      blok,
      status_kependudukan,
    } = req.body;

    const updateData: any = {
      username,
      email,
      is_admin,
      nama,
      no_handphone,
      jalan,
      blok,
      status_kependudukan,

      // update timestamp
      updated_at: sql`now()`,
    };

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(password, salt);
    }

    const user = await db
      .update(usersSchema)
      .set(updateData)
      .where(eq(usersSchema.id, userId))
      .execute();

    res.json({
      status: "success",
      message: "User updated successfully",
      data: {
        username,
        email,
        is_admin,
        nama,
        no_handphone,
        jalan,
        blok,
        status_kependudukan,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    if (userId === req.user.id) {
      return res.status(400).json({
        status: "error",
        message: "You can't delete yourself",
      });
    } else if (req.user.is_admin === true) {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to delete a admin",
      });
    }

    // check if user does not exist
    const user = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .execute();

    if (user.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist",
      });
    }

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
