import * as dotenv from "dotenv";
import { Request, Response } from "express";

// schema imports
import { usersSchema } from "../db/schema/user";
import db from "../db/connection";

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