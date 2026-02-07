import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Components/Context/StoreContext.jsx";
import {
  ShoppingBag,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const { cartItems, food_list, getTotalCartAmount, url, token } =
    useContext(StoreContext);

  const [deliveryInfo, setDeliveryInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDeliveryInfo((deliveryInfo) => ({ ...deliveryInfo, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    console.log("USER TOKEN:", token);

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: deliveryInfo,
      items: orderItems,
      amount: getTotalCartAmount() + 40,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ FIX
      },
    });
    navigate("/payment", {
      state: {
        orderData,
        totalAmount: getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40,
      },
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Complete Your Order
          </h1>
          <p className="text-gray-500 mt-2">
            Review items & enter delivery details
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-blue-500" />
                <h2 className="text-xl font-semibold">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="first_name"
                  placeholder="First Name"
                  value={deliveryInfo.first_name}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  name="last_name"
                  placeholder="Last Name"
                  value={deliveryInfo.last_name}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  name="email"
                  placeholder="Email (optional)"
                  value={deliveryInfo.email}
                  onChange={onChangeHandler}
                  className="sm:col-span-2 p-3 border rounded-lg"
                />
                <input
                  name="street"
                  placeholder="Street"
                  value={deliveryInfo.street}
                  onChange={onChangeHandler}
                  className="sm:col-span-2 p-3 border rounded-lg"
                  required
                />
                <input
                  name="landmark"
                  placeholder="Landmark (optional)"
                  value={deliveryInfo.landmark}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                />
                <input
                  name="city"
                  placeholder="City"
                  value={deliveryInfo.city}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  name="state"
                  placeholder="State"
                  value={deliveryInfo.state}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  name="zip_code"
                  placeholder="Zip Code"
                  value={deliveryInfo.zip_code}
                  onChange={onChangeHandler}
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={deliveryInfo.phone}
                  onChange={onChangeHandler}
                  className="sm:col-span-2 p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{getTotalCartAmount() === 0 ? 0 : 40}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-orange-600">
                  ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg mt-5">
              <Clock className="text-blue-600" />
              <span className="text-blue-600 text-sm">
                Delivery in 30–40 mins
              </span>
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
