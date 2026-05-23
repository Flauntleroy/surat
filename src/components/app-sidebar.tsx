"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { GridIcon, PageIcon, ListIcon } from "@/icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <PageIcon />,
    name: "Surat",
    path: "/dashboard/letters",
  },
  {
    icon: <ListIcon />,
    name: "Pengaturan",
    path: "/dashboard/settings",
    adminOnly: true,
  },
  {
    icon: <GridIcon />,
    name: "Aktivitas",
    path: "/dashboard/activity",
  },
  {
    icon: <ListIcon />,
    name: "Kelola User",
    path: "/dashboard/users",
    adminOnly: true,
  },
];

interface AppSidebarProps {
  userRole?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ userRole = "MEMBER" }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || userRole === "ADMIN"
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <img src="/LogoDWP.png" alt="Logo DWP" className="w-9 h-9 rounded-lg object-contain" />
              <div>
                <span className="text-lg font-semibold text-gray-800 dark:text-white">Nomor Surat</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">DWP</p>
              </div>
            </div>
          ) : (
            <img src="/LogoDWP.png" alt="Logo DWP" className="w-9 h-9 rounded-lg object-contain" />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : "•••"}
              </h2>
              <ul className="flex flex-col gap-2">
                {filteredNavItems.map((nav) => (
                  <li key={nav.name}>
                    <Link
                      href={nav.path}
                      className={`menu-item group ${
                        isActive(nav.path)
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      } ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                    >
                      <span
                        className={`${
                          isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                      {nav.adminOnly && (isExpanded || isHovered || isMobileOpen) && (
                        <span className="ml-auto text-[10px] font-medium bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded dark:bg-orange-500/10 dark:text-orange-400">
                          Admin
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Role indicator */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mx-2 mb-6 rounded-lg bg-gray-50 dark:bg-white/[0.03] p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Role: <span className={`font-medium ${userRole === "ADMIN" ? "text-brand-500" : "text-gray-700 dark:text-gray-300"}`}>{userRole === "ADMIN" ? "Administrator" : "Anggota"}</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
