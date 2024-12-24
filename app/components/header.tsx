"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import {
  FaTachometerAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaBox,
  FaFileInvoiceDollar,
  FaList, // Import the category icon
} from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const menuItems = [
    {
      id: "dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      href: "/",
    },
    {
      id: "penjualan",
      icon: <FaChartLine />,
      label: "Penjualan",
      href: "/penjualan",
    },
    {
      id: "hutang",
      icon: <FaMoneyBillWave />,
      label: "Hutang",
      href: "/hutang",
    },
    {
      id: "produk",
      icon: <FaBox />,
      label: "Produk",
      href: "/produk",
    },
    {
      id: "laporan",
      icon: <FaFileInvoiceDollar />,
      label: "Laporan Penjualan",
      href: "/laporan",
    },
    {
      id: "kategori", // New Kategori item
      icon: <FaList />,
      label: "Kategori",
      href: "/kategori", // Add the corresponding route for Kategori
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="border-b border-slate-700/30">
        <div className="p-6 flex justify-between">
          <h1 className="text-2xl font-semibold text-white">CikiStore</h1>
          <button
            className="text-xl lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <AiOutlineClose className="text-white text-xl" />
            ) : (
              <FaBars className="text-white text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)} // Close sidebar when clicked
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 text-white border-r border-x-slate-700/30 flex flex-col transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-[#1D232A] z-50`}
      >
        <div className="h-24 flex justify-center items-center">
          <h2 className="text-2xl font-bold text-center text-white">
            CikiStore
          </h2>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                pathname === item.href
                  ? "bg-[#A9DFD8] text-[#333] font-semibold"
                  : "hover:bg-zinc-900/40 text-zinc-300 hover:text-white"
              }`}
              onClick={() => setMenuOpen(false)} // Close the menu when clicked
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
