import { Request, Response } from "express";
import HttpStatus from "../utils/http-status";
import db from "../config/db.config";
import { usersTable } from "../db/user";
import hash from "../utils/hash";
import jwt from "../utils/jwt";
import { cookieOptions } from "../utils/cookie-options";
import { eq } from "drizzle-orm";

const AuthController = {
  /**
   * @method POST
   * @access /auth/register
   * @description This method is used for user registration
   */
  register: async (req: Request, res: Response) => {
    const { first_name, last_name, email, password, username } = req.body;

    if (!first_name || !last_name || !email || !password || !username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid request" });
    }

    try {
      const hashedPassword = await hash.hashPassword(password);

      const [user] = await db
        .insert(usersTable)
        .values({
          email,
          first_name,
          last_name,
          password: hashedPassword,
          username,
        })
        .returning({ id: usersTable.id });

      const token = await jwt.generateToken(user.id);

      res.cookie("token", token, cookieOptions);

      return res.status(HttpStatus.CREATED).json({
        message: "Registered Successfully",
      });
    } catch (error: any) {
      if (error.code === 23505) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: "User already exists" });
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  /**
   * @method POST
   * @access /auth/login
   * @description This method is used for user login
   */
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid request" });
    }

    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await hash.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
      }

      const token = await jwt.generateToken(user.id);

      res.cookie("token", token, cookieOptions);

      return res.status(HttpStatus.OK).json({
        message: "Login successful",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  /**
   * @method POST
   * @access /auth/logout
   * @description This method is used for user logout
   */
  logout: async (req: Request, res: Response) => {
    res.clearCookie("token", cookieOptions);
    return res.status(HttpStatus.OK).json({ message: "Logout successful" });
  },
};

export default AuthController;
