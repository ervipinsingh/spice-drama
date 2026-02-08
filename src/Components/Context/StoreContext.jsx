import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  /* ================= STATES ================= */
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");

  /* ================= BASE URL ================= */
  const rawUrl = import.meta.env.VITE_USER_API || "";
  const url = rawUrl.replace(/\/+$/, "");

  /* ================= FETCH FOOD LIST ================= */
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data?.data || []);
    } catch (err) {
      console.error("Food list fetch failed:", err);
      setFoodList([]);
    }
  };

  /* ================= CART ACTIONS ================= */

  // 🔥 STOCK-AWARE ADD TO CART
  const AddToCart = (itemId) => {
    const food = food_list.find((f) => f._id === itemId);
    if (!food) return;

    const stock = food.quantity;
    const currentQty = cartItems[itemId] || 0;

    // ❌ stop if stock finished
    if (currentQty >= stock) return;

    setCartItems((prev) => ({
      ...prev,
      [itemId]: currentQty + 1,
    }));
  };

  const removeCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[itemId]) return updated;
      if (updated[itemId] === 1) delete updated[itemId];
      else updated[itemId] -= 1;
      return updated;
    });
  };

  /* ================= TOTAL AMOUNT ================= */
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const food = food_list.find((f) => f._id === id);
      if (food) total += food.price * cartItems[id];
    }
    return total;
  };

  /* ================= AFTER ORDER SUCCESS ================= */
  const afterOrderSuccess = async () => {
    setCartItems({}); // cart clear
    await fetchFoodList(); // 🔥 quantity fresh load
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchFoodList();
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        AddToCart,
        removeCart,
        getTotalCartAmount,
        fetchFoodList,
        afterOrderSuccess,
        url,
        token,
        setToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
