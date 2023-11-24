"use client";
import Header from "../pages/Home/Header/Header";
import Hero from "../pages/Home/Hero/Hero";
import Intro from "../pages/Home/Intro/Intro";
import Property from "../pages/Home/Property/Property";
import Value from "../pages/Home/Value/Value";
import About from "../pages/Home/About/About";
import Footer from "../pages/Home/Footer/Footer";

import { Provider } from "react-redux";
import Store from "./store";

export default function Home() {
  return (
    <Provider store={Store}>
      <div className="App">
        <Header />
        <Hero />
        <Intro />
        <Property />
        <Value />
        <About />
        <Footer />
      </div>
    </Provider>
  );
}
