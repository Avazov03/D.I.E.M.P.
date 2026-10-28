import React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css"
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/Themeprovider";
import { OfflineBanner } from "@/app/components/shared/offline-banner";


const geist = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: "D.I.E.M.P.",
    template: "%s — D.I.E.M.P.",
  },
  description: "Davlat qarorlari ijrosini nazorat qilish va intellektual tahlil platformasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="uz" suppressHydrationWarning
      data-color-theme="CUSTOM_THEME"
      data-layout="vertical"
      data-boxed-layout="boxed"
      data-sidebar-type="true"
      data-card-shadow="false"
      className="style-lyra"
    >
      <head>
        <link rel="icon" href="/favicons.ico" type="image/svg+xml" />
      </head>
      <body className={`${geist.className} `} >
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
          <OfflineBanner />
        </ThemeProvider>
      </body>
    </html>

  );
}
