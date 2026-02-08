import React from "react";
import { assets } from "../../assets/assets";

function Header() {
  return (
    <div className="relative w-full h-[65vh] md:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <img
        src={assets.header_img}
        alt="header"
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay (mobile stronger, desktop same) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center items-center md:items-start px-4 sm:px-6 md:px-20 pb-10 md:pb-0 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-6xl font-semibold leading-snug text-center md:text-left max-w-xs sm:max-w-md md:max-w-xl">
          Order your <br className="hidden sm:block" />
          <span className="text-orange-400">favourite food</span> here
        </h1>

        <p className="mt-3 text-xs sm:text-sm md:text-lg text-gray-200 text-center md:text-left max-w-xs sm:max-w-md md:max-w-xl">
          Freshly prepared meals delivered straight from our kitchen to your
          doorstep. Great taste, fast delivery, and quality you can trust.
        </p>

        <a
          href="#explore-menu"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("explore-menu")
              .scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg transition-transform duration-300 active:scale-95 md:hover:scale-105"
        >
          🍽️ View Menu
        </a>
      </div>
    </div>
  );
}

export default Header;
