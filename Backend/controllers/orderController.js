import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { items, amount, address } = req.body;

    // 🔒 STEP 1: ATOMIC CHECK + DECREMENT
    for (const item of items) {
      const updatedFood = await foodModel.findOneAndUpdate(
        {
          _id: item.foodId,
          quantity: { $gte: item.quantity },
        },
        {
          $inc: { quantity: -item.quantity },
        },
        { new: true, session },
      );

      if (!updatedFood) {
        throw new Error("Item just went out of stock");
      }
    }

    // 🔒 STEP 2: CREATE ORDER
    const order = new orderModel(
      {
        userId,
        items,
        amount,
        address,
        paymentMethod: "COD",
        payment: false,
        status: "Food Processing",
      },
      { session },
    );

    await order.save();

    // 🔒 STEP 3: CLEAR CART
    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Order placed successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: err.message || "Order failed",
    });
  }
};
