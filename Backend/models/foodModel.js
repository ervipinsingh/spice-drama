import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    // 🔥 SINGLE SOURCE OF TRUTH FOR INVENTORY
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },

    imageId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
