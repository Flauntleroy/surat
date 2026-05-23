"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import Backdrop from "@/layout/Backdrop";
import React from "react";

interface DashboardShellProps {
  children: React.ReactNode;
  userRole?: string;
  userImage?: string | null;
  userName?: string | null;
}

export default function DashboardShell({ children, userRole = "MEMBER", userImage, userName }: DashboardShellProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar userRole={userRole} />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader userImage={userImage} userName={userName} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
