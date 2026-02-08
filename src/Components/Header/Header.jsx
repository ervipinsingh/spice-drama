import React from "react";
import { assets } from "../../assets/assets";

function Header() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white relative w-full px-3 sm:px-5 h-[60vh] md:h-[85vh] md:px-10">
      {/* Background Image */}
      <img
        src={assets.header_img}
        alt="header"
        className="w-full h-full object-cover rounded-md"
      />

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-10 md:px-20 text-white bg-black/30 md:bg-transparent">
        <h1 className="text-xl sm:text-3xl md:text-6xl font-medium leading-tight max-w-xs sm:max-w-md md:max-w-xl">
          Order your <br /> favourite food here
        </h1>

        <p className="mt-3 text-xs sm:text-sm md:text-lg text-justify max-w-xs sm:max-w-md md:max-w-xl">
          Freshly prepared meals delivered straight from our kitchen to your
          doorstep.
          <br />
          Great taste, fast delivery, and quality you can trust.
        </p>

        <a
          href="#explore-menu"
          className="mt-4 inline-block bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-orange-400 hover:text-white transition text-sm sm:text-base"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("explore-menu")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          View Menu
        </a>
      </div>
    </div>
  );
}

export default Header;
