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

    /* ------------------------------------------------
       FIX-2 STEP-A: FIRST ONLY VALIDATE STOCK
       (NO DECREMENT HERE)
    ------------------------------------------------ */
    for (const item of items) {
      const food = await foodModel.findById(item.foodId).session(session);

      if (!food || food.quantity < item.quantity) {
        throw new Error("Item just went out of stock");
      }
    }

    /* ------------------------------------------------
       FIX-2 STEP-B: NOW SAFE TO DECREMENT
    ------------------------------------------------ */
    for (const item of items) {
      await foodModel.findByIdAndUpdate(
        item.foodId,
        { $inc: { quantity: -item.quantity } },
        { session },
      );
    }

    /* ------------------------------------------------
       FIX-2 STEP-C: CREATE ORDER
    ------------------------------------------------ */
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

    /* ------------------------------------------------
       FIX-2 STEP-D: CLEAR USER CART
    ------------------------------------------------ */
    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    /* ------------------------------------------------
       COMMIT EVERYTHING
    ------------------------------------------------ */
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (err) {
    /* ------------------------------------------------
       ROLLBACK EVERYTHING
    ------------------------------------------------ */
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: err.message || "Order failed due to stock issue",
    });
  }
};
