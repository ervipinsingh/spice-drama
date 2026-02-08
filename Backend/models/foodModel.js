import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },

    // 🔥 INVENTORY (ONLY THIS MATTERS)
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    image: { type: String, required: true },
    imageId: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("food", foodSchema);
