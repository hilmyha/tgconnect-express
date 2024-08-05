import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized and Token required" });
  }

  jwt.verify(token, secretKey!, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    
    req.user = user;
    next();
  });
};

export default authMiddleware;