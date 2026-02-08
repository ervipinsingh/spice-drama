import React, { useContext, useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const {
    getTotalCartAmount,
    cartItems,
    food_list,
    url,
    token,
    afterOrderSuccess, // 🔥 CHANGE-3 USE
  } = useContext(StoreContext);

  const navigate = useNavigate();

  /* ---------------- PLACE ORDER (COD) ---------------- */
  const handleCODConfirm = async () => {
    if (getTotalCartAmount() <= 0) return;

    setProcessing(true);

    try {
      // 🔥 Cart → items format for backend
      const items = Object.keys(cartItems).map((id) => {
        const food = food_list.find((f) => f._id === id);
        return {
          foodId: id,
          quantity: cartItems[id],
          name: food?.name,
          price: food?.price,
        };
      });

      const orderData = {
        items,
        amount: getTotalCartAmount(),
        address: "COD Address", // (replace later with real address)
      };

      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order placed successfully");

        // 🔥🔥 CHANGE-3 (MOST IMPORTANT LINE)
        await afterOrderSuccess();

        setOrderComplete(true);
      } else {
        toast.error(res.data.message || "Order failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Order placement failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ---------------- AUTO NAVIGATE ---------------- */
  useEffect(() => {
    if (orderComplete) {
      const timer = setTimeout(() => {
        navigate("/myorders");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [orderComplete, navigate]);

  /* ---------------- ORDER SUCCESS UI ---------------- */
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

  /* ---------------- COD PAGE ---------------- */
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
                  collect <b>₹{getTotalCartAmount()}</b> at your doorstep.
                </p>
              </div>

              <button
                onClick={handleCODConfirm}
                disabled={processing || getTotalCartAmount() <= 0}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing
                  ? "Placing Order..."
                  : getTotalCartAmount() <= 0
                    ? "Add items to place order"
                    : `Place Order (₹${getTotalCartAmount()})`}
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
