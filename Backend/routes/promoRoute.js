import express from "express";
import {
  createPromo,
  applyPromo,
  getAllPromos,
  togglePromoStatus,
  deletePromo,
} from "../controllers/promoController.js";

const promoRouter = express.Router();

promoRouter.post("/create", createPromo);
promoRouter.post("/apply", applyPromo);
promoRouter.get("/list", getAllPromos);
promoRouter.patch("/toggle/:id", togglePromoStatus);
promoRouter.delete("/delete/:id", deletePromo);

export default promoRouter;
