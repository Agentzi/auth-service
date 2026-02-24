import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", authMiddleware, UserController.getUser);
router.put("/", authMiddleware, UserController.updateUser);

export default router;
