import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Components/Context/StoreContext";
import axios from "axios";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [openBillId, setOpenBillId] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      setLoading(true); // start loading

      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        },
      );

      setData(response.data.data || []);
    } catch (error) {
      console.error("Fetch orders failed:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const calculateItemTotal = (items = []) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const toggleBill = (orderId) => {
    setOpenBillId(openBillId === orderId ? null : orderId);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* ✅ LOADING STATE */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="mt-4 text-xl font-semibold text-gray-600">
                📦 Loading your orders...
              </h2>
              <p className="text-gray-500">
                Please wait while we fetch your recent orders.
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          /* ✅ NO ORDERS STATE */
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500">
              When you place orders, they will appear here.
            </p>
          </div>
        ) : (
          /* ✅ ORDERS LIST */
          <div className="space-y-6">
            {data.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-md transition"
              >
                <div className="p-6 space-y-6">
                  {/* HEADER */}
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900">{order._id}</p>
                    </div>

                    <span className="px-3 py-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {order.status || "Processing"}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                        />

                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* INFO + ACTION */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.date && (
                        <div className="flex gap-3 flex-wrap">
                          <span>
                            📅{" "}
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>
                            ⏰{" "}
                            {new Date(order.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}

                      {order.address && (
                        <p>
                          👤 {order.address.first_name}{" "}
                          {order.address.last_name}, 📍 {order.address.city}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.amount}
                      </p>

                      <button
                        onClick={() => toggleBill(order._id)}
                        className="text-sm font-medium text-orange-600 border border-orange-500 px-4 py-1.5 rounded-lg hover:bg-orange-50 transition"
                      >
                        {openBillId === order._id ? "Hide Bill" : "View Bill"}
                      </button>
                    </div>
                  </div>

                  {/* BILL DETAILS */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-in-out
                      ${
                        openBillId === order._id
                          ? "max-h-[300px] opacity-100 translate-y-0 mt-4"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }
                    `}
                  >
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Item Total</span>
                        <span>
                          ₹{order.itemTotal ?? calculateItemTotal(order.items)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Delivery Charge</span>
                        <span>₹{order.deliveryCharge ?? 40}</span>
                      </div>

                      <div className="flex justify-between font-semibold text-base border-t pt-2 text-orange-600">
                        <span>Grand Total</span>
                        <span>₹{order.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* TRACK BUTTON */}
                  <button
                    onClick={fetchOrders}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
