import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/auth.js";

const cartRouter = express.Router();

/* ================= CART ROUTES ================= */

// ADD ITEM TO CART
cartRouter.post("/add", authMiddleware, addToCart);

// REMOVE ITEM FROM CART
cartRouter.post("/remove", authMiddleware, removeFromCart);

// GET USER CART
cartRouter.get("/get", authMiddleware, getCart);

export default cartRouter;
