import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import { Toaster } from "react-hot-toast";
import { PackageSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "PriceHunter | Fiyat Karşılaştırma",
  description: "Amazon, Trendyol, N11 ve Hepsiburada'dan en iyi fiyatları bulun.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen relative">
        <SplashScreen />
        <Navbar />
        <main className="flex-1 pb-32">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
          }}
        />
      </body>
    </html>
  );
}
