import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "SRE UPN Veteran Jawa Timur | Accelerating Sustainable Transition",
  description: "Empowering the next generation of renewable energy leaders. Society of Renewable Energy (SRE) UPN Veteran Jawa Timur drives clean energy advocacy, academic research, and community-led green technology projects.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        <Header />
        {children}
      </body>
    </html>
  );
}
