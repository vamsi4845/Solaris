import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/Providers/SolanaWalletProvider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


export const metadata = {
  title: 'Solaris',
  description: 'Solaris - Your AI Trading Assistant',
  icons: {
    icon: '/logo2.png',
    shortcut: '/logo2.png',
    apple: '/logo2.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
