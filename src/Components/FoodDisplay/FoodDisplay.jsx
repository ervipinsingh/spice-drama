import React, { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category = "Pizza" }) => {
  const { food_list = [] } = useContext(StoreContext);

  return (
    <section
      id="food-display"
      className="relative bg-gradient-to-b from-orange-50 via-white to-orange-100 
                 px-4 sm:px-6 md:px-10 lg:px-16 py-16"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl -z-10" />

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-800">
          Top <span className="text-orange-500">Dishes</span> Near You
        </h1>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">
          Freshly prepared, highly rated & loved by foodies around you
        </p>
      </div>

      {/* Food Grid */}
      <div
        className="grid grid-cols-1
                   sm:grid-cols-2
                   md:grid-cols-3
                   lg:grid-cols-4
                   gap-6 sm:gap-8"
      >
        {food_list.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg bg-white px-6 py-4 rounded-xl shadow-sm">
              😕 No food items available right now
            </p>
          </div>
        ) : (
          food_list.map((item) =>
            category === "All" || category === item.category ? (
              <div
                key={item._id}
                className="transform transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <FoodItem
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              </div>
            ) : null,
          )
        )}
      </div>
    </section>
  );
};

export default FoodDisplay;
