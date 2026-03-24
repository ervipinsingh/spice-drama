import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import sendMail from "../utils/sendMail.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, amount, address } = req.body;

    console.log("📦 Received order request from user:", userId);

    // ================= DUPLICATE CHECK =================
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const recentOrder = await orderModel.findOne({
      userId,
      createdAt: { $gte: tenSecondsAgo },
      status: "Food Processing",
    });

    if (recentOrder) {
      const recentItemIds = recentOrder.items.map((i) => i._id).sort();
      const currentItemIds = items.map((i) => i._id).sort();

      if (JSON.stringify(recentItemIds) === JSON.stringify(currentItemIds)) {
        return res.json({
          success: true,
          message: "Order already placed",
          orderId: recentOrder._id,
          isDuplicate: true,
        });
      }
    }

    // ================= INVENTORY CHECK =================
    for (const item of items) {
      const food = await foodModel.findById(item._id);

      if (!food) {
        return res
          .status(400)
          .json({ success: false, message: "Item not found" });
      }

      if (food.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${food.name}`,
        });
      }

      if (food.isOutOfStock) {
        return res.status(400).json({
          success: false,
          message: `${food.name} is out of stock`,
        });
      }
    }

    // ================= UPDATE STOCK =================
    for (const item of items) {
      const food = await foodModel.findById(item._id);
      food.quantity -= item.quantity;

      if (food.quantity === 0) food.isOutOfStock = true;

      await food.save();
    }

    // ================= CREATE ORDER =================
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

    console.log("✅ Order created:", newOrder._id);

    // ================= CLEAR CART =================
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ================= GET USER =================
    const user = await userModel.findById(userId);

    // ================= HTML =================
    const itemsHTML = items
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `,
      )
      .join("");

    // ================= CUSTOMER MAIL =================
    const customerTemplate = `
      <h2>🍽️ Spice Drama - Order Confirmed</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <b>#${newOrder._id}</b> has been placed.</p>

      <table border="1" cellpadding="8">
        <tr>
          <th>Item</th><th>Qty</th><th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <p><b>Total:</b> ₹${amount}</p>
      <p><b>Address:</b> ${address}</p>
    `;

    // ================= ADMIN MAIL =================
    const adminTemplate = `
      <h2>📦 New Order</h2>
      <p><b>ID:</b> ${newOrder._id}</p>
      <p><b>User:</b> ${user.email}</p>
      <p><b>Amount:</b> ₹${amount}</p>
      ${itemsHTML}
    `;

    // ================= SEND MAIL =================
    await sendMail({
      email: user.email,
      subject: "Order Confirmed 🍕",
      message: customerTemplate,
    });

    await sendMail({
      email: process.env.ADMIN_EMAIL,
      subject: "New Order 🚀",
      message: adminTemplate,
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("❌ PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
    });
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
    res.status(500).json({ success: false });
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
