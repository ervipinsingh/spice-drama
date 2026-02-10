import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  /* ================= STATES ================= */
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");

  const hasInitialized = useRef(false);

  /* ================= BASE URL ================= */
  const rawUrl = import.meta.env.VITE_USER_API || "";
  const url = (() => {
    let base = String(rawUrl).trim().replace(/\/+$/, "");
    if (window.location?.protocol === "https:") {
      base = base.replace(/^http:\/\//i, "https://");
    }
    return base;
  })();

  /* ================= IMAGE URL HELPER ================= */
  const getImageUrl = (image) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) {
      return image.replace(/^http:\/\//i, "https://");
    }
    return `${url}/${image}`;
  };

  /* ================= CART ACTIONS ================= */

  const AddToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        {
          headers: { Authorization: `Bearer ${savedToken}` },
        },
      );
    } catch (err) {
      console.error("AddToCart API failed:", err);
    }
  };

  const removeCart = async (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updated = { ...prev };
      if (updated[itemId] === 1) delete updated[itemId];
      else updated[itemId] -= 1;
      return updated;
    });

    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        {
          headers: { Authorization: `Bearer ${savedToken}` },
        },
      );
    } catch (err) {
      console.error("RemoveCart API failed:", err);
    }
  };

  /* ================= TOTAL AMOUNT ================= */
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const qty = cartItems[itemId];
      const item = food_list.find((p) => p?._id === itemId);
      if (item && qty > 0) total += item.price * qty;
    }
    return total;
  };

  /* ================= API CALLS ================= */

  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data?.data || []);
    } catch (err) {
      console.error("Food list fetch failed:", err);
      setFoodList([]);
    }
  };

  const loadCartData = async (savedToken) => {
    if (!savedToken) return;

    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (res.data?.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Cart load failed:", err);
      }
      setCartItems({});
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    // PREVENT DOUBLE INITIALIZATION IN REACT STRICT MODE
    if (hasInitialized.current) {
      console.log("⚠️ Already initialized, skipping...");
      return;
    }

    hasInitialized.current = true;
    console.log("🚀 Initializing StoreContext...");

    const init = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      } else {
        setCartItems({});
      }
    };

    init();
  }, []);

  /* ================= CONTEXT VALUE ================= */
  const contextValue = {
    food_list,
    setFoodList,
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
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
