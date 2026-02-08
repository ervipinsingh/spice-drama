import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { items, amount, address } = req.body;

    /*
      items format:
      [
        { foodId: "abc123", quantity: 2 },
        { foodId: "xyz456", quantity: 1 }
      ]
    */

    // 🔒 STEP-2A: ATOMIC STOCK CHECK + DECREMENT
    for (const item of items) {
      const updatedFood = await foodModel.findOneAndUpdate(
        {
          _id: item.foodId,
          quantity: { $gte: item.quantity }, // 🔥 GUARANTEE
        },
        {
          $inc: { quantity: -item.quantity },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedFood) {
        throw new Error("Insufficient stock for some items");
      }
    }

    // 🔒 STEP-2B: CREATE ORDER
    const newOrder = new orderModel(
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

    await newOrder.save();

    // 🔒 STEP-2C: CLEAR USER CART
    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { session });

    // 🔒 COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    // ❌ ROLLBACK (STOCK AUTO RESTORE)
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message || "Order failed due to stock issue",
    });
  }
};

export { placeOrder };
