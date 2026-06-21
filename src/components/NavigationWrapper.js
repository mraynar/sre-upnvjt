"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Daftar path yang tidak akan menampilkan Header dan Footer publik
const hiddenHeaderRoutes = [
  "/dashboard",
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
  "/partners",
  "/content",
  "/shortlinks",
  "/leaderboard",
  "/appraisals",
  "/achievements",
  "/achievements/verify",
  "/login",
  "/register",
];

function isHiddenHeaderRoute(pathname) {
  if (!pathname) return false;
  return hiddenHeaderRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

export function HeaderWrapper() {
  const pathname = usePathname();
  if (isHiddenHeaderRoute(pathname)) return null;
  return <Header />;
}

export function FooterWrapper() {
  const pathname = usePathname();
  if (isHiddenHeaderRoute(pathname)) return null;
  return <Footer />;
}
