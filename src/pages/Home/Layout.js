import React from "react";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import Intro from "./Intro/Intro";
import Property from "./Property/Property";
import Value from "./Value/Value";
import About from "./About/About";
import Footer from "./Footer/Footer";

const Layout = () => {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Intro />
      <Property />
      <Value />
      <About />
      <Footer />
    </div>
  );
};

export default Layout;
