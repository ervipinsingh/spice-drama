import { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  /* ================= STATES ================= */

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const [showLogin, setShowLogin] = useState(false);

  /* ✅ COUPON STATES */
  const [discount, setDiscount] = useState(() => {
    return Number(localStorage.getItem("discount")) || 0;
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    return localStorage.getItem("appliedCoupon") || "";
  });

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

  /* ================= SAVE CART TO LOCAL STORAGE ================= */

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /* ✅ SAVE COUPON TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("discount", discount);
    localStorage.setItem("appliedCoupon", appliedCoupon);
  }, [discount, appliedCoupon]);

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
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setShowLogin(true);
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

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

  /* ================= TOTAL CALCULATIONS ================= */

  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const qty = cartItems[itemId];
      const item = food_list.find((p) => p?._id === itemId);
      if (item && qty > 0) total += item.price * qty;
    }
    return total;
  };

  const getFinalAmount = () => {
    const subtotal = getTotalCartAmount();
    const delivery = subtotal > 0 ? 40 : 0;
    const total = subtotal + delivery - discount;
    return total > 0 ? total : 0;
  };

  /* ================= APPLY COUPON ================= */

  const applyCoupon = async (code) => {
    if (!code) return { success: false, message: "Enter promo code" };

    try {
      const response = await axios.post(`${url}/api/promo/apply`, {
        code,
        cartTotal: getTotalCartAmount() + 40,
      });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setAppliedCoupon(code);
        return { success: true };
      } else {
        setDiscount(0);
        setAppliedCoupon("");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: "Error applying coupon" };
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
  };

  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      setDiscount(0);
      setAppliedCoupon("");
      localStorage.removeItem("discount");
      localStorage.removeItem("appliedCoupon");
    }
  }, [cartItems]);

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

      if (res.data?.success && res.data.cartData) {
        const serverCart = res.data.cartData;

        if (Object.keys(serverCart).length > 0) {
          setCartItems(serverCart);
          localStorage.setItem("cartItems", JSON.stringify(serverCart));
        }
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Cart load failed:", err);
      }
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    init();
  }, []);

  /* ================= CLEAR DATA ON LOGOUT ================= */

  /* ================= CONTEXT VALUE ================= */

  const contextValue = {
    food_list,
    setFoodList,
    cartItems,
    setCartItems,
    AddToCart,
    removeCart,
    getTotalCartAmount,
    getFinalAmount,
    applyCoupon,
    removeCoupon,
    discount,
    appliedCoupon,
    url,
    getImageUrl,
    token,
    setToken,
    showLogin,
    setShowLogin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
