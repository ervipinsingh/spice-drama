import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import Exploremenu from "../../Components/ExploreMenu/Exploremenu";
import FoodDisplay from "../../Components/FoodDisplay/FoodDisplay";
import Chef from "../../Components/Chef/Chef";
import Footer from "../../Components/Footer/Footer";
import Contact from "../../Components/Contact/Contact";
import OfferPopup from "../../Components/OfferPopup/OfferPopup";

const Home = () => {
  const [Category, SetCategory] = useState("Pizza");

  return (
    <>
      <Header />
      <Exploremenu Category={Category} SetCategory={SetCategory} />
      <FoodDisplay category={Category} />
      <Chef />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
