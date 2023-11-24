"use client";
import Header from "../components/Home/Header/Header";
import Hero from "../components/Home/Hero/Hero";
import Intro from "../components/Home/Intro/Intro";
import Property from "../components/Home/Property/Property";
import Value from "../components/Home/Value/Value";
import About from "../components/Home/About/About";
import Footer from "../components/Home/Footer/Footer";


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
