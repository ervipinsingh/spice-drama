import userModel from "../models/userModel.js";

/* ================= ADD TO CART ================= */
const addToCart = async (req, res) => {
  try {
    // authMiddleware se aa raha hai
    const userId = req.user._id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.json({
        success: false,
        message: "ItemId is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // initialize cart if empty
    if (!user.cartData) {
      user.cartData = {};
    }

    // add or increment item
    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;

    await user.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

/* ================= REMOVE FROM CART ================= */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.json({
        success: false,
        message: "ItemId is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || !user.cartData[itemId]) {
      return res.json({
        success: false,
        message: "Item not in cart",
      });
    }

    // decrease quantity
    user.cartData[itemId] -= 1;

    // remove key if quantity is 0
    if (user.cartData[itemId] <= 0) {
      delete user.cartData[itemId];
    }

    await user.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

/* ================= GET CART ================= */
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
