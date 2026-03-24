import React, { useContext, useState, useEffect } from "react";
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
    getFinalAmount,
    applyCoupon,
    discount,
    appliedCoupon,
    url,
  } = useContext(StoreContext);

  const [promoList, setPromoList] = useState([]);

  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 && subtotal < 200 ? 40 : 0;
  const itemCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  const handleDeleteItem = (itemId) => {
    const quantity = cartItems[itemId];
    for (let i = 0; i < quantity; i++) {
      removeCart(itemId);
    }
  };

  // CHECK IF CART HAS STOCK ISSUES
  const getStockIssues = () => {
    const issues = [];

    for (const itemId in cartItems) {
      const cartQty = cartItems[itemId];
      const item = food_list.find((p) => p._id === itemId);

      if (item) {
        if (item.isOutOfStock || item.quantity === 0) {
          issues.push({
            itemId,
            name: item.name,
            type: "out_of_stock",
          });
        } else if (cartQty > item.quantity) {
          issues.push({
            itemId,
            name: item.name,
            type: "insufficient_stock",
            available: item.quantity,
            requested: cartQty,
          });
        }
      }
    }

    return issues;
  };

  // promo code state and handler

  const fetchPromos = async () => {
    try {
      const res = await axios.get(url + "/api/promo/list");
      if (res.data.success) {
        // only active & not expired promos
        const validPromos = res.data.promos.filter(
          (p) => p.isActive && new Date(p.expiryDate) > new Date(),
        );
        setPromoList(validPromos);
      }
    } catch (err) {
      console.error("Error fetching promos:", err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const stockIssues = getStockIssues();
  const hasStockIssues = stockIssues.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={28} className="text-gray-700" />
            Shopping Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>

        {/* STOCK ISSUES ALERT */}
        {hasStockIssues && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-red-500 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">
                  Stock Issues Detected
                </h3>
                <ul className="space-y-1 text-sm text-red-700">
                  {stockIssues.map((issue, idx) => (
                    <li key={idx}>
                      {issue.type === "out_of_stock" ? (
                        <>
                          <strong>{issue.name}</strong> is currently out of
                          stock
                        </>
                      ) : (
                        <>
                          <strong>{issue.name}</strong>: Only {issue.available}{" "}
                          available, but you have {issue.requested} in cart
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-red-600">
                  Please adjust quantities before checkout
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {food_list.map((item) => {
                  if (cartItems[item._id] > 0) {
                    // CHECK STOCK STATUS
                    const cartQty = cartItems[item._id];
                    const availableQty = item.quantity || 0;
                    const isOutOfStock =
                      item.isOutOfStock || availableQty === 0;
                    const exceedsStock = cartQty > availableQty;
                    const hasIssue = isOutOfStock || exceedsStock;

                    return (
                      <div
                        key={item._id}
                        className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                          hasIssue ? "bg-red-50" : ""
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Product Info - Mobile: Full Width, Desktop: 6 cols */}
                          <div className="md:col-span-6 flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                {item.name}
                              </h3>

                              {/* STOCK STATUS BADGES */}
                              {isOutOfStock && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                                  OUT OF STOCK
                                </span>
                              )}
                              {/* {!isOutOfStock && exceedsStock && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500 text-white text-xs font-semibold rounded">
                                  Only {availableQty} available
                                </span>
                              )} */}
                              {/* {!isOutOfStock &&
                                !exceedsStock &&
                                availableQty <= 5 && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded">
                                    Low stock: {availableQty} left
                                  </span>
                                )} */}

                              <p className="text-sm text-gray-500 mt-1 md:hidden">
                                ₹{item.price}
                              </p>
                            </div>
                            {/* Mobile Delete Button */}
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          {/* Price - Desktop Only */}
                          <div className="hidden md:block md:col-span-2 text-center">
                            <span className="text-gray-900 font-medium">
                              ₹{item.price}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                            <span className="text-sm text-gray-600 md:hidden">
                              Quantity:
                            </span>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <button
                                onClick={() => removeCart(item._id)}
                                className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} className="text-gray-600" />
                              </button>

                              <span
                                className={`w-8 sm:w-10 text-center font-medium ${
                                  hasIssue ? "text-red-600" : "text-gray-900"
                                }`}
                              >
                                {cartItems[item._id]}
                              </span>

                              <button
                                onClick={() => {
                                  // PREVENT ADDING MORE THAN AVAILABLE STOCK
                                  if (isOutOfStock) {
                                    alert(`${item.name} is out of stock`);
                                    return;
                                  }

                                  if (cartQty >= availableQty) {
                                    alert(
                                      `Only ${availableQty} units of ${item.name} are available in stock`,
                                    );
                                    return;
                                  }

                                  AddToCart(item._id);
                                }}
                                disabled={
                                  isOutOfStock || cartQty >= availableQty
                                }
                                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md border transition-colors ${
                                  isOutOfStock || cartQty >= availableQty
                                    ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                                    : "cursor-pointer border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} className="text-gray-600" />
                              </button>

                              {/* Desktop Delete Button */}
                              <button
                                onClick={() => handleDeleteItem(item._id)}
                                className="cursor-pointer hidden md:block ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Total Price */}
                          <div className="md:col-span-2 flex items-center justify-between md:justify-end">
                            <span className="text-sm text-gray-600 md:hidden">
                              Subtotal:
                            </span>
                            <span className="font-semibold text-gray-900">
                              ₹{item.price * cartItems[item._id]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Empty State */}
              {subtotal === 0 && (
                <div className="px-6 py-16 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start adding items to your cart
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-gray-900">
                      ₹{deliveryFee}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        ₹{getFinalAmount()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CHECKOUT BUTTON WITH STOCK VALIDATION */}
                <button
                  disabled={subtotal === 0 || hasStockIssues}
                  onClick={() =>
                    navigate("/order", {
                      state: {
                        discount,
                        totalAmount: getFinalAmount(),
                      },
                    })
                  }
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white duration-300 transition-colors ${
                    subtotal === 0 || hasStockIssues
                      ? "bg-gray-300 cursor-not-allowed"
                      : "cursor-pointer bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {hasStockIssues ? (
                    <>
                      <AlertCircle size={18} />
                      Fix Stock Issues
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* STOCK WARNING */}
                {hasStockIssues && (
                  <p className="mt-2 text-xs text-red-600 text-center">
                    Remove out-of-stock items or adjust quantities
                  </p>
                )}
              </div>

              {/* PROMO SECTION */}
              <div className="border-t p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} />
                  <label className="text-sm font-medium">Coupons</label>
                </div>

                {/* IF COUPON APPLIED */}
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-green-700 font-semibold">
                        Coupon "{appliedCoupon}" applied 🎉
                      </p>
                      <p className="text-xs text-gray-600">
                        You saved ₹{discount}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        localStorage.removeItem("discount");
                        localStorage.removeItem("appliedCoupon");
                        window.location.reload(); // or better: use removeCoupon()
                      }}
                      className="cursor-pointer text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    {promoList.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">
                          Available Coupons:
                        </p>

                        {promoList.map((promo) => (
                          <div
                            key={promo._id}
                            className="border border-orange-200 bg-orange-50 rounded-lg p-3 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold text-orange-600">
                                {promo.code}
                              </p>
                              <p className="text-xs text-gray-600">
                                {promo.discountType === "percentage"
                                  ? `${promo.discountValue}% OFF`
                                  : `₹${promo.discountValue} OFF`}{" "}
                                | Min ₹{promo.minOrderAmount}
                              </p>
                            </div>

                            <button
                              onClick={async () => {
                                const result = await applyCoupon(promo.code);
                                if (!result.success) alert(result.message);
                              }}
                              className="cursor-pointer text-xs px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
