"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Daftar path root yang merupakan bagian dari Dashboard
const dashboardRoutes = [
  "/dashboard",
  "/tasks",
  "/projects",
  "/attendance",
  "/departments",
  "/users",
  "/roles",
  "/finance",
  "/inventory",
  "/documents",
  "/articles",
  "/activities",
  "/merch",
  "/settings",
  "/partners"
];

function isDashboardRoute(pathname) {
  if (!pathname) return false;
  return dashboardRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

export function HeaderWrapper() {
  const pathname = usePathname();
  if (isDashboardRoute(pathname)) return null;
  return <Header />;
}

export function FooterWrapper() {
  const pathname = usePathname();
  if (isDashboardRoute(pathname)) return null;
  return <Footer />;
}
