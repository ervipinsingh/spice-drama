import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Components/Context/StoreContext.jsx";
import { MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PlaceOrder() {
  const { cartItems, food_list, getTotalCartAmount, token, url } =
    useContext(StoreContext);

  const navigate = useNavigate();

  /* ================= ADDRESS STATES ================= */

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

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

  /* ================= COUPON TOTAL ================= */

  const { discount, getFinalAmount } = useContext(StoreContext);
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const finalTotal = getFinalAmount();

  /* ================= FETCH SAVED ADDRESSES ================= */

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(url + "/api/user/address/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSavedAddresses(res.data.addresses);

        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0]._id);
        }
      }
    } catch (err) {
      console.error("Address fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  /* ================= INPUT HANDLER ================= */

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE NEW ADDRESS ================= */

  const saveNewAddress = async () => {
    try {
      const res = await axios.post(
        url + "/api/user/address/add",
        deliveryInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        setShowNewForm(false);
        fetchAddresses();
      }
    } catch (err) {
      console.error("Save address error:", err);
    }
  };

  /* ================= PROCEED ================= */

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    let selectedAddress = deliveryInfo;

    if (!showNewForm && selectedAddressId) {
      selectedAddress = savedAddresses.find(
        (addr) => addr._id === selectedAddressId,
      );
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: cartItems[item._id],
        });
      }
    });

    navigate("/payment", {
      state: {
        deliveryInfo: selectedAddress,
        orderItems,
        totalAmount: finalTotal,
      },
    });
  };

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    if (!token || subtotal === 0) {
      navigate("/cart");
    }
  }, [token]);

  /* ================= UI ================= */

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
          onSubmit={handleProceedToPayment}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* SAVED ADDRESSES */}
            {savedAddresses.length > 0 && !showNewForm && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Saved Addresses</h2>

                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`border p-3 rounded-lg mb-3 cursor-pointer ${
                      selectedAddressId === addr._id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedAddressId(addr._id)}
                  >
                    <p className="font-semibold">
                      {addr.first_name} {addr.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}, {addr.state}
                    </p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setShowNewForm(true)}
                  className="text-orange-500 text-sm font-medium"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* NEW ADDRESS FORM */}
            {(showNewForm || savedAddresses.length === 0) && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-blue-500" />
                  <h2 className="text-xl font-semibold">Delivery Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(deliveryInfo).map((field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={field.replace("_", " ").toUpperCase()}
                      value={deliveryInfo[field]}
                      onChange={onChangeHandler}
                      className="p-3 border rounded-lg"
                      required
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={saveNewAddress}
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <hr />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-orange-600">₹{finalTotal}</span>
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
