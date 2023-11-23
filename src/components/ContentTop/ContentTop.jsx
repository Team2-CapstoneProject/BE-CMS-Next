"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { SidebarContext } from "../context/sidebarContext";
import "./ContentTop.css";

const ContentTop = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button type="button" onClick={() => toggleSidebar()}>
          <FontAwesomeIcon icon={faBars} className="sidebar-toggler" />
        </button>
      </div>
      <div className="content-top-right">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <button className="notification-btn content-top-btn">
          <FontAwesomeIcon icon={faBell} className="notification-btn" />
        </button>
        <button className="profile-btn content-top-btn">
          <FontAwesomeIcon icon={faUser} className="profile-btn" />
        </button>
      </div>
    </div>
  );
};

export default ContentTop;
