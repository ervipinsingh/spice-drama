import React, { useEffect, useState } from "react";
import axios from "axios";
import FoodItem from "../../Components/FoodItem/FoodItem";
import { url } from "../../assets/assets";

const Menu = () => {
  const [foodList, setFoodList] = useState([]);
  const [category, setCategory] = useState("All");

  // Fetch data from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  return (
    <div className="px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-6">Our Full Menu</h1>

      {/* Category Filter */}
      <div className="flex gap-4 justify-center mb-8 flex-wrap cursor-pointer">
        {[
          "All",
          "Pizza",
          "Burger",
          "Rolls",
          "Paneer",
          "Veg Curries",
          "Daal",
          "Rice",
          "Roti",
          "Chicken",
          "Egg",
          "Fish",
          "Noodles",
          "Maggie",
          "Snacks",
          "Desserts",
          "Beverages",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full border transition 
              ${
                category === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "hover:bg-orange-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodList
          .filter((item) =>
            category === "All"
              ? true
              : item.category?.toLowerCase() === category.toLowerCase(),
          )
          .map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
      </div>
    </div>
  );
};

export default Menu;
