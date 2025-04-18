import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from '@/Providers/SolanaWalletProvider';

const getPoppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Solaris AI",
  description: "An AI powered agent for Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${getPoppins.className}`}
      >
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
