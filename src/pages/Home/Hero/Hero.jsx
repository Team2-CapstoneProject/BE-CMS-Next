import React from "react";
import "./Hero.css";
const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* Left side */}
        <div className="flexColStart hero-left">
          <div className="title-bar">
            <img src="home.png" alt="home-log0" />
            <h2>Villa Agency</h2>
          </div>
          <div className="hero-title">
            <h1>
              Find the perfect
              <br />
              place to stay with
              <br /> your family.
            </h1>
          </div>

          <div className="flexColStart hero-desc">
            <span className="secondaryText">
              Distinctively re-engineer revolutionary meta-services and premium{" "}
              <br /> architectures. Intrinsically incubate.
            </span>
          </div>

          <button className="flexCenter button">
            <h2>Explore Places</h2>
            <img src="./arrow-right.png" alt="" />
          </button>
        </div>
        {/* Right side */}
        <div className="hero-right">
          <div className="image-container">
            <img src="./banner.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
