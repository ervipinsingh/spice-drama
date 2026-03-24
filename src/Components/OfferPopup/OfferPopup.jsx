import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OfferPopup = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem("offerSeen");

    if (!seen) {
      setTimeout(() => {
        setShow(true);
        localStorage.setItem("offerSeen", "true");
      }, 800);
    }
  }, []);

  const handleOrder = () => {
    setShow(false);
    navigate("/menu"); // redirect to menu page
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      
      {/* Popup Box */}
      <div className="relative bg-white w-[90%] max-w-md rounded-2xl overflow-hidden shadow-2xl animate-[scaleUp_0.3s_ease]">

        {/* 🔥 IMAGE BANNER */}
        <img
          src="/offer.jpg"
          alt="offer"
          className="w-full h-44 object-cover"
        />

        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black text-lg px-2 rounded-full"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-2">
            🔥 Special Offer!
          </h2>

          <p className="text-gray-700 mb-2">
            Get <span className="font-bold">30% OFF</span> on your first order 🎉
          </p>

          <p className="text-lg font-semibold mb-4">
            Use Code: <span className="text-orange-500">SPICE30</span>
          </p>

          {/* Order Button */}
          <button
            onClick={handleOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;