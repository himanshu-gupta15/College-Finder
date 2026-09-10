import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { SavedCollegesProvider } from "@/context/SavedCollegesContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollegeFinder - India's Premier College Discovery & Comparison Platform",
  description:
    "Discover 50+ premier Indian colleges across engineering, management, medical, and design. Compare fees, verified placement packages, and campus ratings.",
  keywords: [
    "Indian colleges",
    "IIT",
    "IIM",
    "College discovery India",
    "Compare colleges",
    "College fees",
    "Placement CTC",
    "NIRF ranking",
  ],
  openGraph: {
    title: "CollegeFinder - India's Premier College Discovery Platform",
    description:
      "Explore premier Indian colleges, compare fee structures, real placement packages, and student reviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          <ComparisonProvider>
            <SavedCollegesProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </SavedCollegesProvider>
          </ComparisonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
