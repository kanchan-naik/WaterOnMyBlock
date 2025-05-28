/**
 * Layout.js
 * ---------
 * Top-level layout component for routing structure.
 * Renders the persistent Navbar and a dynamic content area below it.
 * The <Outlet /> is populated by nested routes via react-router-dom.
 *
 * Used as a wrapper for all main pages in the app.
 */

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
