import React from "react";
import './Home.css'


import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/homePageServices/homePageServices";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Statistics from "../../components/Statistics/Statistics";
import Footer from "../../components/Footer/Footer";

const Home = ({ theme, toggleTheme }) => {
  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme}/>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Statistics />
      <Footer />
    </>
  )
}

export default Home;