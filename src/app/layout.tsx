import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PakistanTravel.Agency | Book Hotels, Northern Tours & Rentals in Pakistan",
  description: "Official booking marketplace for Pakistan. Explore luxury hotels in Hunza & Skardu, family tour packages, 4x4 Prado rentals, and local activities with instant confirmation.",
  keywords: ["Pakistan travel", "Hunza hotels", "Skardu tours", "Kalam hotels", "Pakistan booking.com", "Swat resorts", "JazzCash travel booking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-brand-emerald selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
