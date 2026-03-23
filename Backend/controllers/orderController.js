import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import sendMail from "../utils/sendMail.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    console.log("📦 Received order request from user:", userId);

    // ================= IDEMPOTENCY CHECK =================
    const tenSecondsAgo = new Date(Date.now() - 10000);
    const recentOrder = await orderModel.findOne({
      userId,
      createdAt: { $gte: tenSecondsAgo },
      status: "Food Processing",
    });

    if (recentOrder) {
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

    // ================= INVENTORY VALIDATION =================
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

    // ================= DEDUCT STOCK =================
    for (const item of items) {
      const food = await foodModel.findById(item._id);

      food.quantity -= item.quantity;

      if (food.quantity === 0) {
        food.isOutOfStock = true;
      }

      await food.save();
      console.log(`Updated ${food.name}: ${food.quantity} remaining`);
    }

    // ================= CREATE ORDER =================
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
    console.log("Order created:", newOrder._id);

    sendMail({
    email: "atuldhakhaiya@gmail.com",
    subject: "Test Mail",
    message: "<h1>SMTP Working ✅</h1>",
    });

    // ================= CLEAR CART =================
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
    });

    // ================= FETCH USER DETAILS =================
    const user = await userModel.findById(userId);

    // ================= GENERATE ITEMS HTML =================
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

    // ================= CUSTOMER EMAIL =================
    const customerTemplate = `
      <h2>🍽️ Spice Drama - Order Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Your order has been successfully placed.</p>

      <p><b>Order ID:</b> ${newOrder._id}</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <p><b>Total Amount:</b> ₹${req.body.amount}</p>
      <p><b>Delivery Address:</b> ${req.body.address}</p>
      <p><b>Payment Method:</b> COD</p>

      <br/>
      <p>Thank you for ordering from Spice Drama ❤️</p>
    `;

    // ================= ADMIN EMAIL =================
    const adminTemplate = `
      <h2>📦 New Order Received</h2>

      <p><b>Order ID:</b> ${newOrder._id}</p>
      <p><b>Customer:</b> ${user.name}</p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Address:</b> ${req.body.address}</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <p><b>Total:</b> ₹${req.body.amount}</p>
      <p><b>Payment:</b> COD</p>
    `;

    // ================= SEND MAILS =================
    try {
      sendMail({
        email: user.email,
        subject: "Your Order is Confirmed - Spice Drama 🍽️",
        message: customerTemplate,
      });

      sendMail({
        email: process.env.ADMIN_EMAIL,
        subject: "New Order Received - Spice Drama",
        message: adminTemplate,
      });

      console.log("📧 Emails sent successfully");
    } catch (mailError) {
      console.error("❌ Mail Sending Error:", mailError);
      // Order fail nahi hoga agar mail fail ho jaye
    }

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
