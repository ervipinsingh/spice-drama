import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

/* ================= CREATE TOKEN ================= */

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= LOGIN USER ================= */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

/* ================= REGISTER USER ================= */

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.json({
        success: false,
        message: "User already exists with this email",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

/* ================= SAVE ADDRESS ================= */

const saveAddress = async (req, res) => {
  try {
    const userId = req.userId; 
    const newAddress = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent duplicate same address
    const exists = user.addresses.some(
      (addr) =>
        addr.street === newAddress.street &&
        addr.zip_code === newAddress.zip_code &&
        addr.phone === newAddress.phone,
    );

    if (!exists) {
      user.addresses.push(newAddress);
      await user.save();
    }

    res.json({
      success: true,
      message: "Address saved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error saving address",
    });
  }
};

/* ================= GET USER ADDRESSES ================= */

const getUserAddresses = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
      });
    }

    res.json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

export { loginUser, registerUser, saveAddress, getUserAddresses };
