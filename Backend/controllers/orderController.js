import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, amount, address } = req.body;

    /*
      items format (assumed):
      [
        { foodId: "abc123", quantity: 2 },
        { foodId: "xyz456", quantity: 1 }
      ]
    */

    // 🔴 STEP 1: CHECK STOCK FIRST (NO CHANGE YET)
    for (const item of items) {
      const food = await foodModel.findById(item.foodId);

      if (!food) {
        return res.status(400).json({
          success: false,
          message: "Food item not found",
        });
      }

      if (food.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${food.name} is out of stock`,
        });
      }
    }

    // 🟢 STEP 2: CREATE ORDER (STOCK STILL SAME)
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Food Processing",
    });

    await newOrder.save();

    // 🟢 STEP 3: NOW DECREASE QUANTITY (ORDER SUCCESS)
    for (const item of items) {
      await foodModel.findByIdAndUpdate(item.foodId, {
        $inc: { quantity: -item.quantity },
      });
    }

    // 🟢 STEP 4: CLEAR CART
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
    });
  }
};

export { placeOrder };
