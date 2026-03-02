import { Request, Response } from "express";
import HttpStatus from "../utils/http-status";
import db from "../config/db.config";
import { usersTable } from "../db/user";
import { eq, ilike, or } from "drizzle-orm";
import { uploadImage, deleteImage, extractPublicId } from "../utils/cloudinary";

const UserController = {
  /**
   * @method GET
   * @access /user/
   * @description This method is used to get user's details
   */
  getUser: async (req: Request, res: Response) => {
    const id = req.headers["x-user-id"] as string;

    if (!id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }

    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          bio: usersTable.bio,
          profile_url: usersTable.profile_url,
          banner_url: usersTable.banner_url,
          created_at: usersTable.created_at,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id as string))
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
  updateUser: async (req: Request, res: Response) => {
    const id = req.headers["x-user-id"] as string;

    if (!id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid or expired token" });
    }
    const { first_name, last_name, username, bio } = req.body;

    if (!first_name && !last_name && !username && bio === undefined) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "No data provided for update" });
    }

    try {
      const updateData: any = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (username) updateData.username = username;
      if (bio !== undefined) updateData.bio = bio;

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
          bio: usersTable.bio,
          profile_url: usersTable.profile_url,
          banner_url: usersTable.banner_url,
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

  /**
   * @method GET
   * @access /user/search?q=
   * @description Search users by name or username
   */
  searchUsers: async (req: Request, res: Response) => {
    const query = (req.query.q as string) || "";

    if (!query.trim()) {
      return res.status(HttpStatus.OK).json([]);
    }

    try {
      const pattern = `%${query}%`;
      const users = await db
        .select({
          id: usersTable.id,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          bio: usersTable.bio,
          created_at: usersTable.created_at,
          profile_url: usersTable.profile_url,
          banner_url: usersTable.banner_url,
        })
        .from(usersTable)
        .where(
          or(
            ilike(usersTable.first_name, pattern),
            ilike(usersTable.last_name, pattern),
            ilike(usersTable.username, pattern),
          ),
        )
        .limit(20);

      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },

  /**
   * @method GET
   * @access /user/username/:username
   * @description Get a user's public profile by username
   */
  getUserByUsername: async (req: Request, res: Response) => {
    const { username } = req.params;

    if (!username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Username is required" });
    }

    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          bio: usersTable.bio,
          created_at: usersTable.created_at,
          profile_url: usersTable.profile_url,
          banner_url: usersTable.banner_url,
        })
        .from(usersTable)
        .where(eq(usersTable.username, username as string))
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
   * @method GET
   * @access /user/id/:id
   * @description Get a user's public profile by ID
   */
  getUserById: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User ID is required" });
    }

    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          username: usersTable.username,
          bio: usersTable.bio,
          created_at: usersTable.created_at,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id as string))
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
   * @method POST
   * @access /user/upload/profile
   * @description Uploads a profile image to Cloudinary and updates the user record
   */
  uploadProfileImage: async (req: Request, res: Response) => {
    const id = req.headers["x-user-id"] as string;

    if (!id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "No image file provided" });
    }

    try {
      const [currentUser] = await db
        .select({ profile_url: usersTable.profile_url })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);

      if (!currentUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }

      const folder = `agentzi_users/${id}`;
      const publicId = `profile_${Date.now()}`;
      const uploadResult = await uploadImage(req.file.buffer, folder, publicId);

      const [updatedUser] = await db
        .update(usersTable)
        .set({ profile_url: uploadResult.secure_url })
        .where(eq(usersTable.id, id))
        .returning({
          id: usersTable.id,
          profile_url: usersTable.profile_url,
        });

      if (currentUser.profile_url) {
        const oldPublicId = extractPublicId(currentUser.profile_url);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error("Profile upload error:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to upload image" });
    }
  },

  /**
   * @method POST
   * @access /user/upload/banner
   * @description Uploads a banner image to Cloudinary and updates the user record
   */
  uploadBannerImage: async (req: Request, res: Response) => {
    const id = req.headers["x-user-id"] as string;

    if (!id) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "No image file provided" });
    }

    try {
      const [currentUser] = await db
        .select({ banner_url: usersTable.banner_url })
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);

      if (!currentUser) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }

      const folder = `agentzi_users/${id}`;
      const publicId = `banner_${Date.now()}`;
      const uploadResult = await uploadImage(req.file.buffer, folder, publicId);

      const [updatedUser] = await db
        .update(usersTable)
        .set({ banner_url: uploadResult.secure_url })
        .where(eq(usersTable.id, id))
        .returning({
          id: usersTable.id,
          banner_url: usersTable.banner_url,
        });

      if (currentUser.banner_url) {
        const oldPublicId = extractPublicId(currentUser.banner_url);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error("Banner upload error:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to upload image" });
    }
  },
};

export default UserController;
