import React from "react";
import { menu_list } from "../../assets/assets";
import "../../App.css";

const Exploremenu = ({ Category, SetCategory }) => {
  return (
    <div
      className="bg-gradient-to-b from-orange-50 to-white mt-10 pt-10 px-5 md:mx-10"
      id="explore-menu"
    >
      <h1 className="flex justify-center text-2xl sm:text-3xl md:text-4xl">
        Explore Our <span className="text-orange-500">Menu</span>{" "}
      </h1>
      <p className="flex justify-center pt-5 text-gray-500">
        Freshly cooked favorites, delivered hot to your door.
      </p>

      <div className="hide-scrollbar flex gap-6 px-10 py-16 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() => SetCategory(item.menu_name)}
            className="flex flex-col items-center min-w-[120px] snap-start cursor-pointer group"
          >
            <img
              className="h-30 w-30 object-cover rounded-full transform transition duration-300 group-hover:scale-110"
              src={item.menu_image}
              alt=""
            />
            <p className="mt-3 text-center font-medium tracking-wide">
              {item.menu_name}
            </p>
          </div>
        ))}
      </div>

      <hr className="mx-0 text-gray-600" />
    </div>
  );
};

export default Exploremenu;
