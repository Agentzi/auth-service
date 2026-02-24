import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import HttpStatus from "../utils/http-status";
import db from "../config/db.config";
import { usersTable } from "../db/user";
import { eq } from "drizzle-orm";

const UserController = {
  /**
   * @method GET
   * @access /user/
   * @description This method is used to get user's details
   */
  getUser: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }

    const { id } = req.user;

    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          created_at: usersTable.created_at,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);

      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  /**
   * @method PUT
   * @access /user/
   * @description This method is used to update the user's details
   */
  updateUser: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }

    const { id } = req.user;
    const { first_name, last_name, username } = req.body;

    if (!first_name && !last_name && !username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "No data provided for update" });
    }

    try {
      const updateData: any = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (username) updateData.username = username;

      const [updatedUser] = await db
        .update(usersTable)
        .set(updateData)
        .where(eq(usersTable.id, id))
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          created_at: usersTable.created_at,
          updated_at: usersTable.updated_at,
        });

      if (!updatedUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error: any) {
      if (error.code === "23505") {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: "Email or username already exists" });
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
};

export default UserController;
