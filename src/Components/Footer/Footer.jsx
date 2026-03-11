import React from "react";
import { assets } from "../../assets/assets";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <hr className="mt-16 mx-4 sm:mx-10 lg:mx-30" />

      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div
          className="mx-8 sm:mx-10 lg:mx-30 py-16 grid gap-12 
                        grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Left Section */}
          <div>
            <img className="h-20 w-auto mb-4" src={assets.logo} alt="logo" />

            <p className="text-gray-300 text-sm leading-6">
              Freshly crafted in our cloud kitchen, delivered straight to your
              doorstep with love and flavor 🍽️🚀
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/spicedramarestaurant"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-3xl cursor-pointer hover:text-pink-400 transition" />
              </a>
            </div>
          </div>

          {/* Middle Section */}
          {/* <div>
            <h1 className="text-xl font-bold mb-4">Company</h1>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="cursor-pointer hover:text-white">Home</li>
              <li className="cursor-pointer hover:text-white">About us</li>
              <li className="cursor-pointer hover:text-white">Services</li>
              <li className="cursor-pointer hover:text-white">
                Privacy Policy
              </li>
            </ul>
          </div> */}

          <div>
            <h1 className="text-xl font-bold mb-4">Company</h1>

            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/services" className="hover:text-white">
                  Services
                </Link>
              </li>

              <li>
                <Link to="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h1 className="text-xl font-bold mb-4">Get In Touch</h1>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex gap-3 items-start">
                <FaLocationDot className="text-red-500 text-lg mt-1" />
                <span>
                  Spice Drama Restaurant, Akash Nagar, Ghaziabad, 201015
                </span>
              </li>

              <li className="flex gap-3 items-center">
                <FaPhone className="text-blue-400 text-lg" />
                <span>+91 8929550339</span>
              </li>

              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-amber-50 text-lg" />
                <span>order@spicedrama.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="mx-4 sm:mx-10 lg:mx-30" />

        <p className="text-center text-gray-300 text-sm py-4 px-4">
          © 2026 spicedrama.com — All Rights Reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
