import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    console.log("📦 Received order request from user:", userId);

    // ✅✅✅ IDEMPOTENCY CHECK - PREVENT DUPLICATE ORDERS
    // Check if there's a recent order with exact same items within last 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const recentOrder = await orderModel.findOne({
      userId,
      createdAt: { $gte: tenSecondsAgo },
      status: "Food Processing",
    });

    if (recentOrder) {
      // Check if items match
      const recentItemIds = recentOrder.items.map((i) => i._id).sort();
      const currentItemIds = items.map((i) => i._id).sort();

      const isSameOrder =
        JSON.stringify(recentItemIds) === JSON.stringify(currentItemIds);

      if (isSameOrder) {
        console.log("⚠️ DUPLICATE ORDER DETECTED - Returning existing order");
        return res.json({
          success: true,
          message: "Order already placed",
          orderId: recentOrder._id,
          isDuplicate: true,
        });
      }
    }

    // ✅ VALIDATE INVENTORY BEFORE PLACING ORDER
    for (const item of items) {
      const food = await foodModel.findById(item._id);

      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Item "${item.name}" not found`,
        });
      }

      if (food.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${food.name}". Available: ${food.quantity}, Requested: ${item.quantity}`,
        });
      }

      if (food.isOutOfStock) {
        return res.status(400).json({
          success: false,
          message: `"${food.name}" is out of stock`,
        });
      }
    }

    // ✅ DEDUCT QUANTITIES FROM INVENTORY
    for (const item of items) {
      const food = await foodModel.findById(item._id);

      food.quantity -= item.quantity;

      // Mark as out of stock if quantity reaches 0
      if (food.quantity === 0) {
        food.isOutOfStock = true;
      }

      await food.save();
      console.log(`✅ Updated ${food.name}: ${food.quantity} remaining`);
    }

    // ✅ CREATE ORDER
    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: "COD",
      payment: false,
      status: "Food Processing",
    });

    await newOrder.save();
    console.log("✅ Order created:", newOrder._id);

    // ✅ CLEAR CART
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ PLACE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

/* ================= USER ORDERS ================= */
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/* ================= ADMIN ================= */
const listOrders = async (req, res) => {
  const orders = await orderModel.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
};

const updateStatus = async (req, res) => {
  await orderModel.findByIdAndUpdate(req.body.orderId, {
    status: req.body.status,
  });
  res.json({ success: true, message: "Status Updated" });
};

export { placeOrder, userOrders, listOrders, updateStatus };
