"use client"

import "./ContentMain.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard/Dashboard";
import GuestPage from "../../pages/Dashboard/Guest/Guest";
import VillaPage from "../../pages/Dashboard/Villa/Villa";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/guest" element={<GuestPage />} />
        <Route path="/villa" element={<VillaPage />} />
      </Routes>
    </div>
  );
};

export default ContentMain;
