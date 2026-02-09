import React, { useContext, useState, useEffect, useRef } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const hasSubmittedRef = useRef(false); // ✅ PERMANENT FLAG

  const { getTotalCartAmount, cartItems, food_list, url, token, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET ADDRESS DATA FROM PlaceOrder PAGE
  const deliveryInfo = location.state?.deliveryInfo || {
    first_name: "",
    last_name: "",
    street: "Default Street",
    city: "Default City",
    state: "Default State",
    zip_code: "000000",
    phone: "",
  };

  const handleCODConfirm = async () => {
    console.log("=== ORDER BUTTON CLICKED ===");

    // ✅✅✅ TRIPLE PROTECTION
    if (hasSubmittedRef.current) {
      console.log("🚫 Already submitted (ref flag)");
      return;
    }

    if (processing) {
      console.log("🚫 Already processing");
      return;
    }

    if (orderComplete) {
      console.log("🚫 Order already complete");
      return;
    }

    // ✅ LOCK IMMEDIATELY (DON'T RESET THIS)
    hasSubmittedRef.current = true;
    setProcessing(true);

    console.log("🔒 Locked - proceeding with order");

    try {
      // ✅ VALIDATE FOOD LIST
      if (!food_list || food_list.length === 0) {
        console.log("❌ Food list not loaded");
        toast.error("Loading menu... Please try again");
        setProcessing(false);
        hasSubmittedRef.current = false; // Allow retry
        return;
      }

      // ✅ BUILD ORDER ITEMS
      const orderItems = [];

      for (const itemId in cartItems) {
        const quantity = cartItems[itemId];
        if (quantity > 0) {
          const itemInfo = food_list.find((product) => product._id === itemId);
          if (itemInfo) {
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              price: itemInfo.price,
              image: itemInfo.image, // ✅ ADD IMAGE
              quantity: quantity,
            });
          }
        }
      }

      if (orderItems.length === 0) {
        console.log("❌ No items in cart");
        toast.error("Your cart is empty");
        setProcessing(false);
        hasSubmittedRef.current = false;
        return;
      }

      console.log("📦 Order Items:", orderItems);

      // ✅ PREPARE ORDER WITH ACTUAL ADDRESS
      const orderData = {
        items: orderItems,
        amount: getTotalCartAmount() + 40,
        address: deliveryInfo, // ✅ Use real address from PlaceOrder
      };

      console.log("📤 Sending order to backend...");
      console.log("Address:", deliveryInfo);

      // ✅ PLACE ORDER
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Backend response:", response.data);

      // ✅ HANDLE RESPONSE
      if (response.data.success) {
        console.log("✅ Order successful!");

        // Handle duplicate detection
        if (response.data.isDuplicate) {
          console.log("⚠️ Duplicate detected by backend");
        }

        // Clear cart
        setCartItems({});

        // Show success
        toast.success("Order placed successfully!");

        // Mark complete
        setOrderComplete(true);

        // DON'T RESET FLAGS - keep locked
      } else {
        console.log("❌ Order failed:", response.data.message);
        toast.error(response.data.message || "Order failed");
        setProcessing(false);
        hasSubmittedRef.current = false; // Allow retry
      }
    } catch (error) {
      console.error("❌ Order Error:", error);

      // ✅ HANDLE RATE LIMIT (429)
      if (error.response?.status === 429) {
        const msg =
          error.response.data.message ||
          "Please wait before placing another order";
        toast.warning(msg);
        console.log("⏳ Rate limited:", msg);
      } else {
        const errorMsg =
          error.response?.data?.message || "Failed to place order";
        toast.error(errorMsg);
      }

      setProcessing(false);
      hasSubmittedRef.current = false; // Allow retry
    }
  };

  // ✅ REDIRECT ON SUCCESS
  useEffect(() => {
    if (orderComplete) {
      console.log("✅ Redirecting to orders in 2.5s...");

      const timer = setTimeout(() => {
        console.log("➡️ Navigating now");
        navigate("/myorders");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [orderComplete, navigate]);

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Order Confirmed!
          </h2>

          <p className="text-gray-600 mb-6">
            Your order has been placed successfully with Cash on Delivery.
          </p>

          <p className="text-sm text-gray-500">
            Estimated delivery: 30–45 minutes
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- CHECKOUT PAGE ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Confirm Your Order
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* COD INFO */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Cash on Delivery
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Pay when your food arrives
                </p>
                <p className="text-sm text-gray-700">
                  Please keep exact change ready. Our delivery partner will
                  collect <b>₹{getTotalCartAmount() + 40}</b> at your doorstep.
                </p>
              </div>

              <button
                onClick={handleCODConfirm}
                disabled={
                  processing ||
                  getTotalCartAmount() <= 0 ||
                  orderComplete ||
                  hasSubmittedRef.current
                }
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing
                  ? "Placing Order..."
                  : getTotalCartAmount() <= 0
                    ? "Add items to place order"
                    : `Place Order (₹${getTotalCartAmount() + 40})`}
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getTotalCartAmount()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{getTotalCartAmount() === 0 ? 0 : 40}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ₹
                    {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
