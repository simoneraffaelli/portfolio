import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header/header";

const ppNeueMontreal = localFont({
  src: "./fonts/unineue-regular.otf",
});

export const metadata: Metadata = {
  title: "simone",
  description: "me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppNeueMontreal.className} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
