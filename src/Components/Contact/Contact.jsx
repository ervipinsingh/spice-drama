import React from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

function Contact() {
  const openWhatsApp = () => {
    const phoneNumber = "9716159710";
    const message = "Hello! I want to order food";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <hr className="mt-10 mx-4 md:mx-15" />

      <div
        className="w-full bg-gradient-to-b from-white via-orange-50 to-white px-4 md:px-5 relative overflow-hidden"
        id="contact"
      >
        {/* HERO */}
        <section className="text-center py-12 md:py-16 px-2 md:px-6">
          <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
            Let's Connect
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mt-4">
            Get in <span className="text-orange-500">Touch</span>
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-gray-600 text-sm md:text-lg">
            We're here to serve you the best. Reach out for orders, queries, or
            just to say hello!
          </p>
        </section>

        {/* CONTACT CARDS */}
        <section className="max-w-7xl mx-auto px-2 md:px-6 pb-16 md:pb-20">
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {/* Card */}
            {[
              {
                icon: <Phone className="w-6 h-6 text-white" />,
                title: "Call Us",
                text: "Mon-Sun, 10 AM - 11 PM",
                value: "+91 9716159710",
              },
              {
                icon: <Mail className="w-6 h-6 text-white" />,
                title: "Email Us",
                text: "Quick response within 24hrs",
                value: "support@spicedrama.com",
              },
              {
                icon: <MapPin className="w-6 h-6 text-white" />,
                title: "Visit Us",
                text: "Cloud Kitchen Location",
                value: "Ghaziabad, Uttar Pradesh, India",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
              >
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  {item.text}
                </p>
                <p className="text-orange-500 font-semibold text-sm md:text-lg mt-2 break-words">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* ORDER BANNER */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 md:p-12 text-white">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-3">
                  Ready to Order?
                </h2>
                <p className="text-orange-100 text-sm md:text-lg mb-5">
                  Fresh & hygienic food delivered to your doorstep.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={openWhatsApp}
                    className="w-full sm:w-auto bg-white text-orange-600 px-6 py-3 rounded-full font-semibold flex justify-center items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Chat Now
                  </button>

                  <a
                    href="mailto:support@spicedrama.com"
                    className="w-full sm:w-auto bg-white/20 text-white border border-white px-6 py-3 rounded-full font-semibold flex justify-center items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Email
                  </a>
                </div>
              </div>

              {/* INFO */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Operating Hours</p>
                      <p className="text-sm">10 AM - 11 PM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Quick Support</p>
                      <p className="text-sm">WhatsApp Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10">
            {["1000+ Customers", "500+ Orders", "4.8★ Rating", "30-40 min"].map(
              (stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 md:p-6 bg-white rounded-xl shadow"
                >
                  <p className="text-xl md:text-3xl font-bold text-orange-500">
                    {stat.split(" ")[0]}
                  </p>
                  <p className="text-xs md:text-base text-gray-600">
                    {stat.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Contact;
