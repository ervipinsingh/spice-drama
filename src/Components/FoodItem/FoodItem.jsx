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
    } else if (result === false) {
      toast.error("Unable to add item");
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white w-full md:w-[330px] lg:w-[260px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className={`w-full h-40 object-cover ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
          />

          {isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}

          {cartQty === 0 ? (
            !isOutOfStock && (
              <img
                onClick={handleAdd}
                src={assets.add_icon}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer"
              />
            )
          ) : (
            <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-white px-3 py-1 rounded-full">
              <img
                src={assets.remove_icon_red}
                onClick={() => removeCart(id)}
                className="h-5 cursor-pointer"
              />
              <span>{cartQty}</span>
              <img
                src={assets.add_icon_green}
                onClick={handleAdd}
                className={`h-5 ${
                  isOutOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="font-bold mt-1">₹{price}</p>

          {remainingStock > 0 && remainingStock <= 5 && (
            <p className="text-xs text-red-500 mt-1">
              Only {remainingStock} left
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
