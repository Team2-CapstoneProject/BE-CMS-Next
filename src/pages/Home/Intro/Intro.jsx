import React from "react";
import "./Intro.css";

const Intro = () => {
  return (
    <section className="intro-wrapper">
      <div className="paddings innerWidth flexCenter intro-container">
        {/* Left */}
        <div className="flexColStart intro-left">
          <div className="intro-title">
            <h3>
              <span>01</span> | PROPERLAND INTRO
            </h3>
            <h1>
              Rent Villa Property <br />
              In An Easy Way
            </h1>
            <span>
              Distinctively re-engineer revolutionary meta-services and premium{" "}
              <br />
              At vero eos et accusamus et iusto odio dignissimos ducimus <br />
              qui blanditiis praesentium voluptatum deleniti atque corrupti
              <br /> quos dolores et quas molestias excepturi.
            </span>
          </div>
        </div>
        {/* Right */}
        <div className="intro-right">
          <div className="image-containers">
            <img src="./intro.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
