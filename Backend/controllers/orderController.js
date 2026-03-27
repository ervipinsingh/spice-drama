import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import sendMail from "../utils/sendMail.js";

/* ================= PLACE ORDER (COD) ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, amount, address } = req.body;

    const addr = req.body.address;

    const phone = addr.phone || "Not provided";

    const fullAddress = `
      ${addr.street}, 
      ${addr.landmark}, 
      ${addr.city}, 
      ${addr.state} - ${addr.zip_code}
    `;

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
    const itemsHTMLArray = await Promise.all(
      items.map(async (item) => {
        const food = await foodModel.findById(item._id);

        return `
      <tr>
        <td>
          <b>${food.name}</b><br/>
          <small style="color:gray;">${food.description}</small>
        </td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
      </tr>
    `;
      }),
    );

    const itemsHTML = itemsHTMLArray.join("");

    // ================= CUSTOMER MAIL =================
    const customerTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        
        <h2 style="color:#d35400;">🍽️ Spice Drama - Order Confirmed 🎉</h2>
        
        <p>Hi <b>${user.name}</b>,</p>
        
        <p>Thank you for choosing <b>Spice Drama</b> ❤️</p>
        
        <p>Your order <b>#${newOrder._id}</b> has been successfully placed and is now being prepared.</p>

        <p><b>Email:</b> ${user.email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${fullAddress}</p>

        <h3 style="margin-top:20px;">🧾 Order Details</h3>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr style="background-color:#f4f4f4;">
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
          ${itemsHTML}
        </table>

        <p style="margin-top:15px;"><b>Total Amount:</b> ₹${amount}</p>

        <hr/>

        <p style="font-size:14px;">
          🎉 <b>Special Offer:</b> Next time, order directly from our official website 
          and enjoy <b>exclusive discounts & faster service</b> 💸
        </p>

        <p style="font-size:14px;">
          👉 Visit: <a href="https://www.spicedrama.com" target="_blank">www.spicedrama.com</a>
        </p>

        <p style="margin-top:20px;">
          Thanks again for your order! 🙌<br/>
          We’re excited to serve you delicious food 🍕🔥
        </p>

        <p style="margin-top:10px;">
          <b>Team Spice Drama</b>
        </p>

      </div>
    `;

    // ================= ADMIN MAIL =================
    const adminTemplate = `
      <h2>📦 New Order Received 😊👍</h2>

      <p><b>Order ID:</b> ${newOrder._id}</p>
      <p><b>Customer Name:</b> ${user.name},</p>
      <p><b>Customer Email:</b> ${user.email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Address:</b> ${fullAddress}</p>

      <table border="1" cellpadding="8">
        <tr>
          <th>Item</th><th>Qty</th><th>Price</th>
        </tr>
        ${itemsHTML}
      </table>

      <p><b>Total:</b> ₹${amount}</p>
    `;

    // ================= SEND MAIL =================
    await sendMail({
      email: user.email,
      subject: "Order Placed Successfully 🎉",
      message: customerTemplate,
    });

    await sendMail({
      email: process.env.COMPANY_ADMIN_EMAIL,
      subject: "New Order Received 🎉",
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
