import React, { useContext, useState, useEffect, useRef } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const isSubmittingRef = useRef(false);

  const { getTotalCartAmount, cartItems, food_list, url, token, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const handleCODConfirm = async () => {
    console.log("=== HANDLE COD CONFIRM CALLED ===");
    console.log("Current state:", {
      processing,
      isSubmittingRef: isSubmittingRef.current,
      orderComplete,
      cartItems,
      food_list_length: food_list.length,
    });

    // ✅ PREVENT DOUBLE SUBMISSION
    if (processing || isSubmittingRef.current || orderComplete) {
      console.log("🚫 Blocked: Already processing");
      return;
    }

    // ✅ MARK AS PROCESSING
    isSubmittingRef.current = true;
    setProcessing(true);

    console.log("🛒 Cart Items:", cartItems);
    console.log("🍔 Food List Count:", food_list.length);

    try {
      // ✅ SAFEGUARD: Check if food_list is loaded
      if (!food_list || food_list.length === 0) {
        console.log("❌ Food list not loaded yet!");
        toast.error("Loading menu... Please try again");
        setProcessing(false);
        isSubmittingRef.current = false;
        return;
      }

      // ✅ BUILD ORDER ITEMS
      const orderItems = [];

      for (const itemId in cartItems) {
        const quantity = cartItems[itemId];
        console.log(`Processing item ${itemId}, qty: ${quantity}`);
        
        if (quantity > 0) {
          const itemInfo = food_list.find((product) => product._id === itemId);
          console.log(`Found item info:`, itemInfo);
          
          if (itemInfo) {
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              price: itemInfo.price,
              quantity: quantity,
            });
          } else {
            console.log(`⚠️ Item ${itemId} not found in food_list`);
          }
        }
      }

      console.log("📦 Final Order Items:", orderItems);
      console.log("📦 Order Items Count:", orderItems.length);

      // ✅ VALIDATE
      if (orderItems.length === 0) {
        console.log("❌ Cart is empty");
        toast.error("Your cart is empty");
        setProcessing(false);
        isSubmittingRef.current = false;
        return;
      }

      // ✅ PREPARE ORDER
      const orderData = {
        items: orderItems,
        amount: getTotalCartAmount() + 40,
        address: {
          street: "Default Street",
          city: "Default City",
          state: "Default State",
          zipcode: "000000",
        },
      };

      console.log("📤 Sending order:", orderData);

      // ✅ API CALL
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Response:", response.data);

      if (response.data.success) {
        console.log("✅ Order successful!");
        
        // ✅ CLEAR CART IMMEDIATELY
        setCartItems({});
        
        // ✅ SHOW SUCCESS
        toast.success("Order placed successfully!");
        
        // ✅ SET ORDER COMPLETE (triggers redirect)
        setOrderComplete(true);
        
        // Keep flags locked - don't reset
      } else {
        console.log("❌ Order failed:", response.data.message);
        toast.error(response.data.message || "Order failed");
        setProcessing(false);
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error("❌ Order Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to place order";
      toast.error(errorMsg);
      setProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  // ✅ REDIRECT AFTER SUCCESS
  useEffect(() => {
    console.log("🔄 orderComplete changed:", orderComplete);
    
    if (orderComplete) {
      console.log("✅ Order complete - redirecting in 2.5s");
      
      const timer = setTimeout(() => {
        console.log("➡️ Navigating to /myorders");
        navigate("/myorders");
      }, 2500);

      return () => {
        console.log("🧹 Cleanup timer");
        clearTimeout(timer);
      };
    }
  }, [orderComplete, navigate]);

  // ✅ CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  /* ---------------- ORDER SUCCESS SCREEN ---------------- */
  if (orderComplete) {
    console.log("🎉 Showing success screen");
    
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
                disabled={processing || getTotalCartAmount() <= 0 || orderComplete}
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