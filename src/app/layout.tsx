import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task 1 - GLB",
  description: "Workspace for manipulating GLB models for Nelson Cabinetry Task 1.",
  keywords: ["Nelson Cabinetry", "GLB", "Three.js", "Task 1"],
  openGraph: {
    title: "Task 1 - GLB",
    description: "Drag, rotate, and inspect GLB assets for the Nelson Cabinetry assessment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Task 1 - GLB",
    description: "Drag, rotate, and inspect GLB assets for the Nelson Cabinetry assessment.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
