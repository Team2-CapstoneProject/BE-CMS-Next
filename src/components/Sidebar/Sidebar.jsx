"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import "../Sidebar/Sidebar.css";
import { SidebarContext } from "../context/sidebarContext";

import { logoutUser } from "../../redux/actions/AuthActions";
import { useDispatch } from "react-redux";
import {
  faHome,
  faUsers,
  faBuilding,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("/dashboard");
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
  }, [isSidebarOpen]);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const handleLinkClick = (pathname) => {
    setActiveLink(pathname);
    router.push(pathname);

    if (pathname === "/dashboard/logout") {
      handleLogout();
    }
  };

  const handleLogout = () => {
    try {
      // console.log('1');
      localStorage.removeItem('token');
      dispatch(logoutUser()).then(() => router.push("/login"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <span className="info-name">Azure Voyage</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          <div className="spacer"></div>
          <li className="nav-item">
            <Link
              href="/dashboard"
              className={`nav-link ${
                activeLink === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/dashboard")}
            >
              <FontAwesomeIcon icon={faHome} className="nav-link-icon" />
              <span className="nav-link-text">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/dashboard/guest"
              className={`nav-link ${
                activeLink === "/dashboard/guest" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/dashboard/guest")}
            >
              <FontAwesomeIcon icon={faUsers} className="nav-link-icon" />
              <span className="nav-link-text">Guest</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/dashboard/villa"
              className={`nav-link ${
                activeLink === "/dashboard/villa" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/dashboard/villa")}
            >
              <FontAwesomeIcon icon={faBuilding} className="nav-link-icon" />
              <span className="nav-link-text">Villa</span>
            </Link>
          </li>
        </ul>

        <div className="spacer"></div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link
              href="/dashboard/logout"
              className={`nav-link ${
                activeLink === "/dashboard/logout" ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/dashboard/logout")}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-link-icon" />
              <span className="nav-link-text">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
