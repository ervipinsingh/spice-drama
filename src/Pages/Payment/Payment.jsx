import React, { useContext, useState, useEffect, useRef } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const hasSubmittedRef = useRef(false);

  const {
    cartItems,
    food_list,
    url,
    token,
    setCartItems,
    removeCoupon,
    setFoodList,
    discount,
    getFinalAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= GET DATA FROM PLACEORDER ================= */

  const deliveryInfo = location.state?.deliveryInfo || {};
  const finalAmount = getFinalAmount();

  /* ================= REFRESH FOOD ================= */

  const refreshFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data?.success) {
        setFoodList(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to refresh food list:", err);
    }
  };

  /* ================= PLACE ORDER ================= */

  const handleCODConfirm = async () => {
    if (hasSubmittedRef.current || processing || orderComplete) return;

    hasSubmittedRef.current = true;
    setProcessing(true);

    try {
      if (!food_list || food_list.length === 0) {
        toast.error("Loading menu... Please try again");
        setProcessing(false);
        hasSubmittedRef.current = false;
        return;
      }

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
              image: itemInfo.image,
              quantity,
            });
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setProcessing(false);
        hasSubmittedRef.current = false;
        return;
      }

      const orderData = {
        items: orderItems,
        amount: finalAmount,
        discount,
        address: deliveryInfo,
      };

      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCartItems({});
        removeCoupon();
        await refreshFoodList();
        toast.success("Order placed successfully!");
        setOrderComplete(true);
      } else {
        toast.error(response.data.message || "Order failed");
        setProcessing(false);
        hasSubmittedRef.current = false;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to place order";
      toast.error(errorMsg);
      setProcessing(false);
      hasSubmittedRef.current = false;
    }
  };

  /* ================= REDIRECT ================= */

  useEffect(() => {
    if (orderComplete) {
      const timer = setTimeout(() => {
        navigate("/myorders");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [orderComplete, navigate]);

  /* ================= SUCCESS SCREEN ================= */

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

  /* ================= CHECKOUT PAGE ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Confirm Your Order
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
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
                  collect <b>₹{finalAmount}</b> at your doorstep.
                </p>
              </div>

              <button
                onClick={handleCODConfirm}
                disabled={processing || finalAmount <= 0 || orderComplete}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {processing
                  ? "Placing Order..."
                  : finalAmount <= 0
                    ? "Add items to place order"
                    : `Place Order (₹${finalAmount})`}
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
                  <span>Discount</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{finalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
