import express from "express";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.get("/", UserController.getUser);
router.put("/", UserController.updateUser);

export default router;
