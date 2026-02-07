import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ FIX

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
