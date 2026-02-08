import React from "react";
import { assets } from "../../assets/assets";

function Header() {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white relative w-full px-5 h-[55vh] md:h-[85vh] md:px-10">
      {/* Background Image */}
      <img
        src={assets.header_img}
        alt="header"
        className="w-full h-full object-cover rounded"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20 text-white">
        <h1 className="text-2xl pl-8 pt-15 sm:text-4xl md:text-6xl font-medium leading-tight max-w-xl">
          Order your <br /> favourite food here
        </h1>
        <p className="py-3 text-sm text-justify px-8 md:text-lg">
          Freshly prepared meals delivered straight from our kitchen to your
          doorstep. <br /> Great taste, fast delivery, and quality you can
          trust.
        </p>
        <a
          href="#explore-menu"
          className="mt-4 inline-block bg-white text-black px-4 py-2 ml-8 rounded-full font-medium hover:bg-orange-400 hover:text-white transition"
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
