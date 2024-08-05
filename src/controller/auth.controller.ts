import * as dotenv from "dotenv";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// schema imports
import { usersSchema } from "../db/schema/user";
import db from "../db/connection";
import { eq, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { refreshTokenSchema } from "../db/schema/refreshtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// Register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // check if username and email already exists
    const userOrEmailExist = await db
      .select()
      .from(usersSchema)
      .where(
        or(eq(usersSchema.username, username), eq(usersSchema.email, email))
      )
      .execute();

    const usernameExists = userOrEmailExist.some(
      (user) => user.username === username
    );
    const emailExists = userOrEmailExist.some((user) => user.email === email);

    if (usernameExists) {
      return res.status(400).json({
        status: "error",
        message: `Username ${username} already exists`,
      });
    } else if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: `Email ${email} already exists`,
      });
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

// Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const [user] = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.username, username))
      .execute();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `Sorry username ${username} not found`,
      });
    }

    // check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }

    // generate token
    const token = jwt.sign({ id: user.id }, secretKey!, {
      expiresIn: "1h",
    });

    // generate refresh token
    const refreshToken = uuidv4();

    // save refresh token
    await db
      .insert(refreshTokenSchema)
      .values({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      })
      .execute();

    // send response
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
        refreshToken,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // check if refresh token exists
    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    // check if refresh token exists in db
    const [refreshTokenData] = await db
      .select()
      .from(refreshTokenSchema)
      .where(eq(refreshTokenSchema.token, refreshToken))
      .execute();

    if (!refreshTokenData) {
      return res.status(404).json({
        status: "error",
        message: "Refresh token not found",
      });
    }

    // check if refresh token has expired
    if (new Date() > refreshTokenData.expires_at) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token has expired",
      });
    }

    // check if user exists
    const [user] = await db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, refreshTokenData.user_id))
      .execute();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // generate token
    const token = jwt.sign({ id: user.id }, secretKey!, {
      expiresIn: "1h",
    });

    // send response
    return res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
