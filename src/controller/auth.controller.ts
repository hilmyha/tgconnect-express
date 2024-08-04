import * as dotenv from "dotenv";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// schema imports
import { usersSchema } from "../db/schema/user";
import db from "../db/connection";
import { eq } from "drizzle-orm";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // check if username and email already exists
    const usernameExist = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.username, username))
      .execute();

    const emailExists = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .execute();

    if (usernameExist.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    } else if (emailExists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create user
    await db
      .insert(usersSchema)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .execute();

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { username, email },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
