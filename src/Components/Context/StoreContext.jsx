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

  /* ================= LOAD CART FROM DB ================= */
  const loadCartData = async (authToken) => {
    if (!authToken) {
      setCartItems({});
      return;
    }

    try {
      const res = await axios.get(`${url}/api/cart/get`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.data?.success) {
        setCartItems(res.data.cartData || {});
      } else {
        setCartItems({});
      }
    } catch (err) {
      setCartItems({});
    }
  };

  /* ================= ADD TO CART (BACKEND AUTHORITY) ================= */
  const AddToCart = async (itemId) => {
    const food = food_list.find((f) => f._id === itemId);
    if (!food) return false;

    const currentQty = cartItems[itemId] || 0;
    if (currentQty >= food.quantity) return false;

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      return "NO_LOGIN";
    }

    try {
      const res = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );

      if (res.data?.success) {
        await loadCartData(authToken); // 🔥 sync cart
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeCart = async (itemId) => {
    const authToken = localStorage.getItem("token");
    if (!authToken) return;

    try {
      const res = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${authToken}` } },
      );

      if (res.data?.success) {
        await loadCartData(authToken);
      }
    } catch (err) {
      console.error("RemoveCart failed:", err);
      await loadCartData(authToken);
    }
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
    const authToken = localStorage.getItem("token");

    setCartItems({}); // instant UI clear
    await fetchFoodList(); // 🔥 updated quantities
    await loadCartData(authToken); // server cart confirm (empty)
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
    loadCartData,
    afterOrderSuccess,
    url,
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
