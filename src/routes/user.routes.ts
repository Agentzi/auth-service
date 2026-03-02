import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", UserController.getUser);
router.put("/", UserController.updateUser);
router.get("/search", UserController.searchUsers);
router.get("/username/:username", UserController.getUserByUsername);
router.get("/id/:id", UserController.getUserById);

export default router;
