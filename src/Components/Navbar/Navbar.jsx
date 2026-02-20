import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { StoreContext } from "../Context/StoreContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const { token, setToken, cartItems, setShowLogin } = useContext(StoreContext);

  const totalCartItems = Object.values(cartItems || {}).reduce(
    (total, qty) => total + qty,
    0,
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setProfileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    console.log("Navbar cart:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <>
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 md:px-20 py-4">
          {/* Logo */}
          <Link to="/">
            <img src={assets.logo} alt="logo" className="h-14" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link
              to="/"
              className="hover:text-orange-400 transition duration-300 hover:scale-110"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-orange-400 transition duration-300 hover:scale-110"
            >
              About Us
            </Link>
            <Link
              to="/menu"
              className="hover:text-orange-400 transition duration-300 hover:scale-110"
            >
              Menu
            </Link>
            <Link
              to="/services"
              className="hover:text-orange-400 transition duration-300 hover:scale-110"
            >
              Services
            </Link>
            <a
              href="#contact"
              className="hover:text-orange-400 transition duration-300 hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </a>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-6">
            {token && totalCartItems > 0 && (
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-xl text-gray-600 hover:text-orange-500 transition" />

                {/* Badge */}
                <motion.span
                  key={totalCartItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full"
                >
                  {totalCartItems}
                </motion.span>
              </Link>
            )}

            {!token ? (
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-1.5 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white transition"
              >
                Sign in
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <motion.img
                  src="profile.png"
                  alt="profile"
                  className="w-7 h-7 rounded-full cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                />

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-4 w-44 rounded-xl bg-white/100 backdrop-blur-xl shadow-xl border overflow-hidden"
                    >
                      <Link
                        to="/myorders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-sm"
                        onClick={() => setProfileOpen(false)}
                      >
                        <img src={assets.bag_icon} className="w-5" />
                        Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-500"
                      >
                        <img src={assets.logout_icon} className="w-5" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(true)}>
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-[70%] max-w-sm bg-white z-50 p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          >
            <div className="flex justify-end">
              <FaTimes
                className="text-2xl cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            </div>

            <div className="flex flex-col gap-6 mt-10 text-lg">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/menu" onClick={() => setMenuOpen(false)}>
                Menu
              </Link>
              <Link to="/services" onClick={() => setMenuOpen(false)}>
                Services
              </Link>

              {token && totalCartItems > 0 && (
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="relative"
                >
                  Cart
                  <span className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalCartItems}
                  </span>
                </Link>
              )}

              {!token ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setTimeout(() => setShowLogin(true), 300);
                  }}
                  className="mt-6 border rounded-full py-2 text-orange-500 border-orange-400 hover:bg-orange-500 hover:text-white transition"
                >
                  Sign in
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="mt-6 border rounded-full py-2 text-red-500 border-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
