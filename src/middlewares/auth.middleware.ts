import { NextFunction, Request, Response } from "express";
import HttpStatus from "../utils/http-status";
import jwt from "../utils/jwt";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * @access authMiddleware()
 * @description This is the auth middleware which will block unauthorized requests
 */
const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const decoded = (await jwt.verifyToken(token)) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
