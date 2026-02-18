import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import promoRouter from "./routes/promoRoute.js";

/* ================= APP CONFIG ================= */
const app = express();
const PORT = process.env.PORT || 4000;

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

/* ================= DATABASE ================= */
connectDB();

/* ================= ROUTES ================= */
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("API Working");
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
