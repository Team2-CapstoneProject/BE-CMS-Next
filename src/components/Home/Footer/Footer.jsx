import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <section className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        <div className="flexColStart f-left">
          <img src="./logo.png" alt="logo-company" />

          <span>
            Our Vision is to make all people <br />
            the best place to rest.
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span>Jakarta, Indonesia</span>

          <div className="flexMenu f-menu">
            <span>Company</span>
            <span>Property</span>
            <span>About</span>
            <a href="login">Admin</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
