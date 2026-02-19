import express from "express";
import {
  loginUser,
  registerUser,
  saveAddress,
  getUserAddresses,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

/* ================= AUTH ================= */

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

/* ================= ADDRESS ROUTES ================= */

userRouter.post("/address/add", authMiddleware, saveAddress);
userRouter.get("/address/list", authMiddleware, getUserAddresses);

export default userRouter;
