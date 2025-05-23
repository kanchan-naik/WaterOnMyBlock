import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
