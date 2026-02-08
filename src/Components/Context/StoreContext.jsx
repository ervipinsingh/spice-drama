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

  // ✅ STOCK-AWARE ADD TO CART (FINAL FIX)
  const AddToCart = async (itemId) => {
    const food = food_list.find((f) => f._id === itemId);
    if (!food) return;

    const stock = food.quantity;
    const currentQty = cartItems[itemId] || 0;

    // 🔒 HARD STOP — STOCK LIMIT
    if (currentQty >= stock) {
      return;
    }

    // optimistic UI
    setCartItems((prev) => ({
      ...prev,
      [itemId]: currentQty + 1,
    }));

    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { Authorization: `Bearer ${savedToken}` } }
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
        { headers: { Authorization: `Bearer ${savedToken}` } }
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

  /* ================= LOAD CART FROM DB ================= */
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

  /* ================= AFTER ORDER SUCCESS ================= */
  const afterOrderSuccess = async () => {
    setCartItems({});
    await fetchFoodList(); // 🔥 quantity UI refresh
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
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
    cartItems,
    AddToCart,
    removeCart,
    getTotalCartAmount,
    fetchFoodList,
    afterOrderSuccess,
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
