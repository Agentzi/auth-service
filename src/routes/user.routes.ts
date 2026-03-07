import express from "express";
import multer from "multer";
import UserController from "../controllers/user.controller";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", UserController.getUser);
router.put("/", UserController.updateUser);
router.get("/search", UserController.searchUsers);
router.get("/check-username/:username", UserController.checkUsernameAvailability);
router.get("/username/:username", UserController.getUserByUsername);
router.get("/id/:id", UserController.getUserById);

router.post(
  "/upload/profile",
  upload.single("image"),
  UserController.uploadProfileImage,
);
router.post(
  "/upload/banner",
  upload.single("image"),
  UserController.uploadBannerImage,
);

export default router;
