"use client";
import Header from "../pages/Home/Header/Header";
import Hero from "../pages/Home/Hero/Hero";
import Intro from "../pages/Home/Intro/Intro";
import Property from "../pages/Home/Property/Property";
import Value from "../pages/Home/Value/Value";
import About from "../pages/Home/About/About";
import Footer from "../pages/Home/Footer/Footer";


export default function Home() {
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
}
