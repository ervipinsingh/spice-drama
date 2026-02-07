import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  /* ---------------- STATES ---------------- */
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");

  /* ---------------- BASE URL ---------------- */
  const rawUrl = import.meta.env.VITE_USER_API || "";
  const url = (() => {
    let base = String(rawUrl).trim().replace(/\/+$/, "");
    if (
      typeof window !== "undefined" &&
      window.location?.protocol === "https:"
    ) {
      base = base.replace(/^http:\/\//i, "https://");
    }
    return base;
  })();

  /* ---------------- IMAGE URL HELPER ---------------- */
  const getImageUrl = (image) => {
    if (!image) return "";
    const val = String(image).trim();
    if (!val) return "";

    if (/^https?:\/\//i.test(val)) {
      return val.replace(/^http:\/\//i, "https://");
    }

    return `${url}/${val}`;
  };

  /* ---------------- CART ACTIONS ---------------- */
  const AddToCart = async (itemID) => {
    setCartItems((prev = {}) => ({
      ...prev,
      [itemID]: (prev[itemID] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId: itemID },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        },
      );
    }
  };

  const removeCart = async (itemID) => {
    setCartItems((prev = {}) => {
      if (!prev[itemID]) return prev;

      const updated = { ...prev };
      if (updated[itemID] === 1) {
        delete updated[itemID];
      } else {
        updated[itemID] -= 1;
      }
      return updated;
    });

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId: itemID },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        },
      );
    }
  };

  /* ---------------- TOTAL AMOUNT ---------------- */
  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];
      if (quantity > 0) {
        const itemInfo = food_list.find((product) => product?._id === itemId);
        if (!itemInfo) continue;
        totalAmount += itemInfo.price * quantity;
      }
    }

    return totalAmount;
  };

  /* ---------------- API CALLS ---------------- */
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data?.data || []);
    } catch (err) {
      console.error("Food list fetch failed:", err);
      setFoodList([]);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(url + "/api/cart/get", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIX
        },
      });
      setCartItems(response.data?.cartData || {});
    } catch (err) {
      console.error("Cart load failed:", err);
      setCartItems({});
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  /* ---------------- CONTEXT VALUE ---------------- */
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    AddToCart,
    removeCart,
    getTotalCartAmount,
    url,
    getImageUrl,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
