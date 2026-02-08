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
    cartItems,
    food_list,
    getTotalCartAmount,
    afterOrderSuccess,
    url,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleCODConfirm = async () => {
    if (getTotalCartAmount() <= 0) return;

    setProcessing(true);

    try {
      const items = Object.keys(cartItems).map((id) => ({
        foodId: id,
        quantity: cartItems[id],
      }));

      const res = await axios.post(
        `${url}/api/order/place`,
        { items, amount: getTotalCartAmount(), address: "COD" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        toast.success("Order placed successfully");
        await afterOrderSuccess(); // 🔥 AUTO UPDATE
        setOrderComplete(true);
      } else {
        toast.error(res.data.message || "Order failed");
      }
    } catch (err) {
      toast.error("Order failed due to stock issue");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (orderComplete) {
      const t = setTimeout(() => navigate("/myorders"), 2500);
      return () => clearTimeout(t);
    }
  }, [orderComplete, navigate]);

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl text-center">
          <Check className="mx-auto text-green-600" size={48} />
          <h2 className="text-2xl font-bold mt-4">Order Confirmed</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <button
        onClick={handleCODConfirm}
        disabled={processing}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg"
      >
        {processing
          ? "Placing Order..."
          : `Place Order ₹${getTotalCartAmount()}`}
      </button>
    </div>
  );
}
