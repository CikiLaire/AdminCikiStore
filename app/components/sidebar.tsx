"use client";

import React from "react";
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

const Sidebar = () => {
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
      id: "kategori", // New Kategori item
      icon: <FaList />,
      label: "Kategori",
      href: "/kategori", // Add the corresponding route for Kategori
    },
    {
      id: "laporan",
      icon: <FaFileInvoiceDollar />,
      label: "Laporan Penjualan",
      href: "/laporan",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 text-white border-r border-x-slate-700/30 flex flex-col">
      <div className="h-24 flex justify-center items-center">
        <h2 className="text-2xl font-bold text-center text-white">CikiStore</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`
              flex items-center p-3 rounded-lg transition-all duration-300
              ${
                pathname === item.href
                  ? "bg-[#A9DFD8] text-[#333] font-semibold"
                  : "hover:bg-zinc-900/40 text-zinc-300 hover:text-white"
              }
            `}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
