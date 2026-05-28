import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from '@/src/app/StoreProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <head>
        <title>NaturaVerse</title>
        <meta name="description" content="NaturaVerse - A Natural Aesthetic Showcase App" />
      </head>
      <body className="min-h-full bg-white text-black">
      <StoreProvider>
        {children}
      </StoreProvider>
      </body>
      </html>
  );
}