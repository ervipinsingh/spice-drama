import React from "react";
import { menu_list } from "../../assets/assets";
import "../../App.css";

const Exploremenu = ({ Category, SetCategory }) => {
  return (
    <div
      className="bg-gradient-to-b from-orange-50 to-white mt-6 sm:mt-10 pt-6 sm:pt-10 mx-4 px-4 sm:mx-5 sm:px-5 md:mx-20"
      id="explore-menu"
    >
      <h1 className="flex justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
        Explore our menu
      </h1>
      <p className="flex justify-center pt-3 sm:pt-5 text-sm sm:text-base text-gray-500 text-center px-2">
        Freshly cooked favorites, delivered hot to your door.
      </p>

      <div className="hide-scrollbar flex gap-4 sm:gap-6 px-2 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() => SetCategory(item.menu_name)}
            className={`flex flex-col items-center min-w-[90px] sm:min-w-[110px] md:min-w-[120px] snap-start cursor-pointer group transition-all duration-300 ${
              Category === item.menu_name ? "scale-105" : ""
            }`}
          >
            <div className="relative">
              <img
                className={`h-20 w-20 sm:h-24 sm:w-24 md:h-30 md:w-30 object-cover rounded-full transform transition duration-300 group-hover:scale-110 ${
                  Category === item.menu_name
                    ? "ring-4 ring-orange-500 ring-offset-2"
                    : ""
                }`}
                src={item.menu_image}
                alt={item.menu_name}
              />
              {Category === item.menu_name && (
                <div className="absolute inset-0 rounded-full bg-orange-500/20"></div>
              )}
            </div>
            <p
              className={`mt-2 sm:mt-3 text-center font-medium tracking-wide text-xs sm:text-sm md:text-base ${
                Category === item.menu_name
                  ? "text-orange-500 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.menu_name}
            </p>
          </div>
        ))}
      </div>

      <hr className="mx-0 border-gray-300" />
    </div>
  );
};

export default Exploremenu;
