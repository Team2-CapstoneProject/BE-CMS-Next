"use client"

import Sidebar from "../../components/Sidebar/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./Content.css";
import ContentTop from "../../components/ContentTop/ContentTop";

export default function DashboardLayout ({ children }) {
  return (
    <div className="app">
      <ProtectedRoute >
        <Sidebar />
        <div className="main-content">
          <ContentTop />
          <div className="main-content-holder">
            {children}
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};
