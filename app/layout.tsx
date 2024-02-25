import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrueChek",
  description: "The best application for automatic detection of websites and content that can be fake/malicious!",
  referrer: 'origin-when-cross-origin',
  keywords: ["TrueCheck", "Prosoft", "Prosoft@NT", "AI"],
  authors:[
    {name: "Neauna Madalin", url:'https://nnmadalin.me/'}
  ]

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
