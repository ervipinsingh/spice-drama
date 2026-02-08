import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../Context/StoreContext";
import { toast } from "react-toastify";

const FoodItem = ({ id, name, description, price, image, quantity }) => {
  const { cartItems, AddToCart, removeCart } = useContext(StoreContext);

  const cartQty = cartItems[id] || 0;
  const remainingStock = quantity - cartQty;
  const isOutOfStock = remainingStock <= 0;

  const handleAdd = async () => {
    if (isOutOfStock) {
      toast.error("Item is out of stock");
      return;
    }

    const result = await AddToCart(id);
    if (result === "NO_LOGIN") {
      toast.error("Please login to add items");
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white w-full md:w-[330px] lg:w-[260px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105">
        {/* IMAGE WRAPPER */}
        <div className="relative">
          {/* 👇 IMAGE SHOULD NOT BLOCK CLICKS */}
          <img
            src={image}
            alt={name}
            className={`w-full h-40 object-cover pointer-events-none ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />

          {/* OUT OF STOCK BADGE */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-20">
              Out of Stock
            </div>
          )}

          {/* ADD / COUNTER (Z-INDEX FIXED) */}
          {cartQty === 0 ? (
            !isOutOfStock && (
              <button
                onClick={handleAdd}
                className="absolute bottom-2 right-2 z-30 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition"
              >
                <img src={assets.add_icon} alt="add" />
              </button>
            )
          ) : (
            <div className="absolute bottom-2 right-2 z-30 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-lg">
              <button onClick={() => removeCart(id)}>
                <img
                  src={assets.remove_icon_red}
                  alt="remove"
                  className="h-5"
                />
              </button>

              <span className="font-semibold">{cartQty}</span>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`${
                  isOutOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
              >
                <img src={assets.add_icon_green} alt="add" className="h-5" />
              </button>
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="p-4 space-y-2">
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-gray-600 text-sm">{description}</p>
          <p className="text-black text-lg font-bold">₹{price}</p>

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
