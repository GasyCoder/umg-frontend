import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

import { Nunito } from "next/font/google"; // Updated font requested by user

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Université de Mahajanga",
  description: "Site officiel de l'Université de Mahajanga",
  manifest: "/manifest.webmanifest",
  themeColor: "#101622",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
