import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../Components/Context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  AlertCircle,
} from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    food_list,
    AddToCart,
    removeCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ✅ Promo States
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const totalBeforeDiscount = subtotal + deliveryFee;
  const itemCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // ✅ Apply Promo
  const applyPromoCode = async () => {
    if (!promoCode) {
      setPromoMessage("Please enter a promo code");
      return;
    }

    try {
      const response = await axios.post(url + "/api/promo/apply", {
        code: promoCode,
        cartTotal: totalBeforeDiscount,
      });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setFinalAmount(response.data.finalAmount);
        setPromoMessage("Promo Applied Successfully 🎉");
      } else {
        setDiscount(0);
        setFinalAmount(0);
        setPromoMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setPromoMessage("Error applying promo");
    }
  };

  // ✅ Remove Item Fully
  const handleDeleteItem = (itemId) => {
    const quantity = cartItems[itemId];
    for (let i = 0; i < quantity; i++) {
      removeCart(itemId);
    }
  };

  const finalTotal = finalAmount > 0 ? finalAmount : totalBeforeDiscount;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <ShoppingCart size={24} />
            Shopping Cart ({itemCount})
          </h1>

          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-500 text-sm">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeCart(item._id)}
                      className="p-2 border rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{cartItems[item._id]}</span>

                    <button
                      onClick={() => AddToCart(item._id)}
                      className="p-2 border rounded"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="p-2 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="font-semibold">
                    ₹{item.price * cartItems[item._id]}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Promo Section */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} />
              <span className="text-sm font-medium">Promo Code</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <button
                onClick={applyPromoCode}
                className="px-4 py-2 bg-black text-white text-sm rounded"
              >
                Apply
              </button>
            </div>

            {promoMessage && (
              <p className="text-xs mt-2 text-gray-600">{promoMessage}</p>
            )}
          </div>

          {/* Checkout */}
          <button
            disabled={subtotal === 0}
            onClick={() => navigate("/order")}
            className={`w-full mt-6 py-3 rounded text-white font-medium ${
              subtotal === 0
                ? "bg-gray-300"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            Proceed to Checkout
            <ArrowRight size={16} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
