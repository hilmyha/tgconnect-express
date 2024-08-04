import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

declare module "express" {
  export interface Request {
    user?: any;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    jwt.verify(token, secretKey!, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      req.user = user;
      next();
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export default authMiddleware;
