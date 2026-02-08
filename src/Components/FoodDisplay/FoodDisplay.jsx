import React, { useContext } from "react";
import { StoreContext } from "../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category = "Pizza" }) => {
  const { food_list = [] } = useContext(StoreContext);

  return (
    <div
      id="food-display"
      className="bg-gradient-to-b from-orange-50 to-white px-4 sm:px-6 md:px-10 py-10 lg:px-16"
    >
      {/* Heading */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl
                 text-center sm:mt-16 mb-8"
      >
        Top <span className="text-orange-500">Dishes</span>{" "} Near You
      </h1>

      {/* Food Grid */}
      <div
        className="grid grid-cols-1
               sm:grid-cols-2
               md:grid-cols-3
               lg:grid-cols-4
               gap-6 sm:gap-8"
      >
        {food_list.length === 0 ? (
          <p className="col-span-full text-gray-500 text-lg text-center">
            No food items available
          </p>
        ) : (
          food_list.map((item) =>
            category === "All" || category === item.category ? (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ) : null,
          )
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
