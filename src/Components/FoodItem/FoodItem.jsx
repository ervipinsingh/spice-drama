import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../Context/StoreContext";

const FoodItem = ({ id, name, description, price, image }) => {
  const { cartItems, AddToCart, removeCart, getImageUrl } =
    useContext(StoreContext);

  return (
    <>
      <div className=" bg-gradient-to-b from-orange-50 to-white w-full md:w-[330px] lg:w-[260px]">
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden
                  transform transition duration-300 hover:scale-105"
        >
          {/* Image + Add/Counter */}
          <div className="relative">
            <img src={image} alt={name} className="w-full h-40 object-cover" />

            {/* Add / Counter Buttons */}
            {!cartItems[id] ? (
              <img
                onClick={() => AddToCart(id)}
                src={assets.add_icon}
                alt=""
                className="absolute bottom-2 right-2 bg-white border-0 p-2 rounded-full 
                     cursor-pointer hover:scale-110 transition"
              />
            ) : (
              <div
                className="absolute bottom-2 right-2 flex items-center gap-2
                        bg-white px-3 py-1 rounded-full shadow-lg"
              >
                <img
                  onClick={() => removeCart(id)}
                  src={assets.remove_icon_red}
                  alt=""
                  className="h-5 cursor-pointer hover:scale-110 transition"
                />

                <p className="font-semibold text-black">{cartItems[id]}</p>

                <img
                  onClick={() => AddToCart(id)}
                  src={assets.add_icon_green}
                  alt=""
                  className="h-5 cursor-pointer hover:scale-110 transition"
                />
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">{name}</p>
              <img src={assets.rating_starts} alt="" className="h-4" />
            </div>

            <p className="text-gray-600 text-sm">{description}</p>

            <p className="text-black text-lg font-bold">₹{price}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodItem;
