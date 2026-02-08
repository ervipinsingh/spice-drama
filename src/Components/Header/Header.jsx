import React from "react";
import { assets } from "../../assets/assets";

function Header() {
  return (
    <div className="relative h-[70vh] min-h-[500px] sm:min-h-[600px] bg-cover bg-center bg-no-repeat">
      {/* Background Image */}
      <img
        src={assets.header_img}
        alt="Food banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/40 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              Order your favourite food here
            </h1>

            <p className="text-white text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed opacity-90">
              Freshly prepared meals delivered straight from our kitchen to your
              doorstep. Great taste, fast delivery, and quality you can trust.
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("explore-menu")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white text-gray-800 px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 
                         rounded-full font-semibold text-sm sm:text-base md:text-lg 
                         hover:bg-gray-100 transition-all duration-300 
                         shadow-lg hover:shadow-xl transform hover:scale-105 
                         active:scale-95 inline-block"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
