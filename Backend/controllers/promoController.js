import Promo from "../models/promoModel.js";

// ============================
// CREATE PROMO (ADMIN)
// ============================
export const createPromo = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate } =
      req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const existing = await Promo.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Promo already exists",
      });
    }

    const newPromo = new Promo({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      expiryDate,
    });

    await newPromo.save();

    res.json({
      success: true,
      message: "Promo Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error creating promo",
    });
  }
};

// ============================
// APPLY PROMO (USER)
// ============================
export const applyPromo = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.json({
        success: false,
        message: "Promo code is required",
      });
    }

    const promo = await Promo.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return res.json({
        success: false,
        message: "Invalid Promo Code",
      });
    }

    if (promo.expiryDate < new Date()) {
      return res.json({
        success: false,
        message: "Promo Expired",
      });
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

    // Prevent negative total
    if (discount > cartTotal) {
      discount = cartTotal;
    }

    const finalAmount = cartTotal - discount;

    res.json({
      success: true,
      discount,
      finalAmount,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error applying promo",
    });
  }
};

// ============================
// GET ALL PROMOS (ADMIN)
// ============================
export const getAllPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      promos,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error fetching promos",
    });
  }
};

// ============================
// TOGGLE PROMO STATUS
// ============================
export const togglePromoStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const promo = await Promo.findById(id);

    if (!promo) {
      return res.json({
        success: false,
        message: "Promo not found",
      });
    }

    promo.isActive = !promo.isActive;
    await promo.save();

    res.json({
      success: true,
      message: "Promo status updated",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error updating promo",
    });
  }
};

// ============================
// DELETE PROMO
// ============================
export const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;

    await Promo.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Promo deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error deleting promo",
    });
  }
};
