"use client"

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "500",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-screen w-screen ${roboto.className}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}