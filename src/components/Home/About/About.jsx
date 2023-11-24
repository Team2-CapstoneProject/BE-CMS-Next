import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-wrapper">
      <div className="paddings innerWidth flexCenter about-container">
        {/* Left side */}
        <div className="flexColStart about-left">
          <div className="about-title">
            <h3>
              <span>04</span> | ABOUT US
            </h3>
            <h1>
              Truting of helping
              <br />
              you find the right Propertys
            </h1>
          </div>

          <div className="flexColStart about-desc">
            <span>
              Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
              <br /> atque corrupti quos dolores et quas molestias
              excepturi.Lorem ipsum
              <br />
              dolor sit amet, consectetur adipiscing elit.
            </span>
          </div>

          <button className="flexCenter button">
            <h2>Learn More</h2>
            <img src="./arrow.png" alt="" />
          </button>
        </div>
        {/* Right side */}
        <div className="about-right">
          <div className="image-container">
            <img src="./about.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
