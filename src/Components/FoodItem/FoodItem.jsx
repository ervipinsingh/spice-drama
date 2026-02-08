import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../Context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, description, price, image, quantity }) => {
  const { cartItems, AddToCart, removeCart } = useContext(StoreContext);

  const cartQty = cartItems[id] || 0;

  // 🔥 REAL REMAINING STOCK (LIVE)
  const remainingStock = quantity - cartQty;

  const isOutOfStock = remainingStock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error("Item is out of stock");
      return;
    }
    AddToCart(id);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white w-full md:w-[330px] lg:w-[260px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
        {/* IMAGE + CART */}
        <div className="relative">
          <img
            src={image}
            alt={name}
            className={`w-full h-40 object-cover ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />

          {/* OUT OF STOCK BADGE */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}

          {/* ADD / COUNTER */}
          {cartQty === 0 ? (
            !isOutOfStock && (
              <img
                onClick={handleAdd}
                src={assets.add_icon}
                alt="add"
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer hover:scale-110 transition"
              />
            )
          ) : (
            <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-lg">
              <img
                onClick={() => removeCart(id)}
                src={assets.remove_icon_red}
                alt="remove"
                className="h-5 cursor-pointer hover:scale-110 transition"
              />

              <p className="font-semibold text-black">{cartQty}</p>

              <img
                onClick={handleAdd}
                src={assets.add_icon_green}
                alt="add"
                className={`h-5 transition ${
                  isOutOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:scale-110"
                }`}
              />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">{name}</p>
            <img src={assets.rating_starts} alt="rating" className="h-4" />
          </div>

          <p className="text-gray-600 text-sm">{description}</p>

          <p className="text-black text-lg font-bold">₹{price}</p>

          {/* 🔥 LIVE STOCK INFO */}
          {remainingStock > 0 && remainingStock <= 5 && (
            <p className="text-xs text-red-500 font-medium">
              Only {remainingStock} left
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
