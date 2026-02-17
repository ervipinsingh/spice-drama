import React from "react";
import {
  FaTruck,
  FaUtensils,
  FaLeaf,
  FaClock,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Services() {
  return (
    <div className="w-full bg-gradient-to-b from-orange-50 to-white">
      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-800">
          Our Services
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-gray-600">
          Freshly prepared food from our cloud kitchen, delivered with speed,
          hygiene, and love.
        </p>
      </section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {services.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition"
          >
            <div className="text-orange-500 text-4xl mb-4 flex justify-center">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-orange-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow"
            >
              <div className="text-orange-500 text-3xl mb-3">{step.icon}</div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose Spice Drama?
        </h2>

        <div className="grid md:grid-cols-2 gap-10 mt-12">
          {reasons.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="text-orange-500 text-2xl">
                <FaStar />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-18 text-center text-white">
        <h2 className="text-3xl font-bold">Hungry? Let the Drama Begin!</h2>
        <p className="my-7">
          Order now and enjoy freshly cooked meals delivered to your doorstep.
        </p>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Order Now
        </Link>
      </section>
    </div>
  );
}

export default Services;

/* DATA */
const services = [
  {
    title: "Online Food Ordering",
    desc: "Order your favorite dishes easily through our website or delivery apps.",
    icon: <FaUtensils />,
  },
  {
    title: "Fast Delivery",
    desc: "Hot and fresh food delivered quickly with safe and hygienic packaging.",
    icon: <FaTruck />,
  },
  {
    title: "Hygienic Cooking",
    desc: "Prepared in a clean cloud kitchen using high-quality ingredients.",
    icon: <FaLeaf />,
  },
  {
    title: "Bulk & Party Orders",
    desc: "Perfect meals for parties, events, and family gatherings.",
    icon: <FaUsers />,
  },
  {
    title: "Freshly Cooked Meals",
    desc: "Every order is cooked fresh after you place it.",
    icon: <FaClock />,
  },
  {
    title: "Quality & Taste",
    desc: "Authentic flavors crafted by experienced chefs.",
    icon: <FaStar />,
  },
];

const steps = [
  {
    title: "Browse Menu",
    desc: "Explore our wide range of delicious dishes.",
    icon: <FaUtensils />,
  },
  {
    title: "Place Order",
    desc: "Order online with easy and secure checkout.",
    icon: <FaClock />,
  },
  {
    title: "We Cook Fresh",
    desc: "Our chefs prepare your food with care.",
    icon: <FaLeaf />,
  },
  {
    title: "Fast Delivery",
    desc: "Delivered hot and fresh to your doorstep.",
    icon: <FaTruck />,
  },
];

const reasons = [
  {
    title: "Cloud Kitchen Excellence",
    desc: "Focused on food quality without dine-in compromise.",
  },
  {
    title: "Affordable Pricing",
    desc: "Delicious food at pocket-friendly prices.",
  },
  {
    title: "Customer Satisfaction",
    desc: "Your happiness and taste matter the most.",
  },
  {
    title: "Trusted & Reliable",
    desc: "Loved by hundreds of happy customers.",
  },
];
