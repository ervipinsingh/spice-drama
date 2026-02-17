import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";

const About = () => {
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 via-white to-orange-50 text-white overflow-hidden">
        {/* ================= HERO SECTION ================= */}
        <section className="relative h-[85vh] flex items-center justify-center text-center">
          <img
            src="./about-img.jpg"
            alt="Spice Drama Food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 px-6 max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Where Every Bite <br />
              <span className="text-orange-400">Tells a Story</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Welcome to{" "}
              <span className="text-orange-400 font-semibold">Spice Drama</span>{" "}
              — a cloud kitchen built for bold flavors, unforgettable aromas,
              and food that creates drama on your taste buds.
            </p>
          </motion.div>
        </section>

        {/* ================= OUR STORY ================= */}
        <section className="py-24 px-6 md:px-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              alt="Cooking"
              className="rounded-3xl shadow-2xl"
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-orange-600">
                Our Story 🍲
              </h2>

              <p className="text-gray-600 leading-relaxed text-lg">
                Spice Drama was born from one belief —
                <span className="font-semibold text-gray-800">
                  great food doesn’t need a fancy dining room, it needs soul.
                </span>
                <br />
                <br />
                As a modern cloud kitchen, we focus purely on what matters:
                fresh ingredients, authentic spices, and recipes crafted to
                deliver restaurant-quality taste straight to your doorstep.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="bg-orange-100 py-24 px-6 md:px-20">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Spice Drama? 🔥
          </motion.h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "🌶️",
                title: "Bold Flavors",
                desc: "Every dish is crafted with hand-picked spices to create unforgettable taste.",
              },
              {
                icon: "🍽️",
                title: "Made Fresh",
                desc: "No compromise on hygiene, freshness, and quality — every order is freshly prepared.",
              },
              {
                icon: "🚀",
                title: "Fast Delivery",
                desc: "Straight from our kitchen to your door, hot and full of drama.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-orange-600">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="relative py-28 text-center text-white">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="Food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75"></div>

          <motion.div
            className="relative z-10 px-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for Some Drama on Your Plate?
            </h2>
            <p className="text-gray-200 mb-8 text-lg">
              Order now and experience flavors that speak louder than words.
            </p>

            <Link
              to="/"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Order Now 🍽️
            </Link>
          </motion.div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
