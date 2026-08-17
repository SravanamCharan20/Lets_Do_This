/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Documents", path: "/document" },
    { name: "Profile", path: "/profile" },
    { name: "ShowDocs", path: "/show-docs" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
        
        {/* Logo */}
        <Link
          to="/"
          className="mr-2 rounded-full px-4 py-2 text-sm font-semibold tracking-tight transition hover:bg-white/10"
        >
          MyApp
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                  active
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-2 h-5 w-px bg-white/10" />

        {/* Logout */}
        <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-red-500/20 hover:text-red-300">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;