import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OfferPopup = () => {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // ⏳ Timer
  // useEffect(() => {
  //   if (!show) return;

  //   const interval = setInterval(() => {
  //     setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [show]);

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShow(false);
      setClosing(false);
    }, 400);
  };

  const handleOrder = () => {
    closePopup();
    setTimeout(() => {
      navigate("/menu", { state: { category: "Pizza" } });
    }, 300);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999]">
      {/* Popup */}
      <div
        className={`relative w-[95%] max-w-2xl rounded-3xl overflow-hidden shadow-2xl 
        backdrop-blur-xl bg-white/10 border border-white/20 text-white
        ${closing ? "animate-popupClose" : "animate-popupOpen"}`}
      >
        {/* IMAGE with overlay */}
        <div className="relative">
          <img
            src="combo 1.png"
            alt="offer"
            className="w-full h-80 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Close */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 bg-white/85 hover:bg-white font-bold text-black px-3 py-1 rounded-full"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-3xl font-extrabold text-orange-400 mb-2">
            🔥 Pickup Special Offer!
          </h2>

          {/* Timer */}
          {/* <p className="text-red-400 font-semibold mb-3">
            ⏳ Offer ends in: {formatTime(timeLeft)}
          </p> */}

          <p className="text-lg mb-2">
            Get <span className="font-bold text-yellow-300">50% OFF</span> on
            Combo Meals 🎉
          </p>

          <p className="text-sm text-gray-300 mb-2">
            *Only on Self take away (No Delivery)
          </p>

          {/* Code */}
          <p className="text-xl font-semibold mb-4">
            Use Code: <span className="text-orange-400 text-2xl">PICK50</span>
          </p>

          {/* Address */}
          <div className="text-sm text-gray-300 mb-3">
            📍 <b>Pickup Location:</b> Spice Drama Cloud Kitchen, Akash Nagar,
            Ghaziabad
          </div>

          {/* Timing */}
          <div className="text-sm text-gray-300 mb-5">
            ⏰ <b>Timing:</b> 1 PM – 11 PM
          </div>

          {/* Contact */}
          <div className="text-sm text-gray-300 mb-5">
            📞 <b>Contact:</b> +91 8929550339
          </div>

          {/* CTA */}
          <button
            onClick={handleOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            Order & Pickup 🍽️
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;
