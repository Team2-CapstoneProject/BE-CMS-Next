import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <section className="h-wrapper">
      <div className="flexCenter paddings innerWidth h-container ">
        <img src="./logo.png" alt="logo" />

        <div className="flexCenter h-menu">
          <a href="/">Get Started</a>
          <a href="/">Featured</a>
          <a href="/">Why Choose</a>
          <a href="/">About Us</a>
          <button className="button">Contact</button>
        </div>
      </div>
    </section>
  );
};

export default Header;
