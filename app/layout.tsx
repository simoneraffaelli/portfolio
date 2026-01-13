import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header/header";
import { Providers } from "./utils/contexts/providers";
import KeySequenceHandler from "./components/easteregg/easteregg";
import { easterEggSequence } from "./components/easteregg/eastereggutils";

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
        className={`${ppNeueMontreal.className} antialiased m-auto`}
      >
        <Providers>
          <KeySequenceHandler
            sequence={easterEggSequence}/>
          <Header/>
          {children}
       </Providers>
      </body>
    </html>
  );
}
