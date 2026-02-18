import Promo from "../models/promoModel.js";

export const applyPromo = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const promo = await Promo.findOne({ code: code.toUpperCase() });

    if (!promo || !promo.isActive) {
      return res.json({ success: false, message: "Invalid Promo Code" });
    }

    if (promo.expiryDate < new Date()) {
      return res.json({ success: false, message: "Promo Code Expired" });
    }

    if (cartTotal < promo.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order ₹${promo.minOrderAmount} required`,
      });
    }

    let discount = 0;

    if (promo.discountType === "percentage") {
      discount = (cartTotal * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    res.json({
      success: true,
      discount,
      finalAmount: cartTotal - discount,
    });
  } catch (error) {
    res.json({ success: false, message: "Error applying promo" });
  }
};
