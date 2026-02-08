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
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    isOutOfStock: {
      type: Boolean,
      default: false,
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
