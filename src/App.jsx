import { Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "./Components/Context/StoreContext";
import AuthPage from "./Components/Authentication/AuthPage";

import MainLayout from "./Layout/Mainlayout";
import AuthLayout from "./Layout/Authlayout";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Services from "./Pages/Services/Services";
import Menu from "./Pages/Menu/Menu";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Verify from "./Pages/Verify/Verify";
import MyOrders from "./Pages/MyOrders/MyOrders";
import Payment from "./Pages/Payment/Payment";
import Privacy from "./Pages/Privacy Policy/Privacy";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const location = useLocation();
  const { showLogin } = useContext(StoreContext);

  return (
    <>
      <ScrollToTop />

      {/* Page Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Routes location={location}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<PlaceOrder />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/myorders" element={<MyOrders />} />
              <Route path="/privacy-policy" element={<Privacy />} />
            </Route>

            <Route element={<AuthLayout />}></Route>
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Login Popup */}
      <AnimatePresence>{showLogin && <AuthPage />}</AnimatePresence>
    </>
  );
}

export default App;
