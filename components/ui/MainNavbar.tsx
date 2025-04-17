"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from "./resizable-navbar";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { usePrivy } from '@privy-io/react-auth';
import { PrivyAuthButton } from '@/components/privy-auth-button';

export function MainNavbar() {
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [hasInitializedUser, setHasInitializedUser] = useState(false);

  // Handle wallet connection and database operations
// This part of your current code looks good already - detecting connection and calling the backend
// useEffect(() => {
//   const initializeUser = async () => {
//     if (isConnected && publicKey && !hasInitializedUser) {
//       try {
//         const walletAddress = publicKey.toString();
//         console.log("Wallet connected:", walletAddress);
        
//         // Store user in database via API call
//         const response = await fetch('/api/users/init', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             walletAddress,
//             timestamp: new Date().toISOString(),
//           }),
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setHasInitializedUser(true);
          
//           // Check if this is a new user based on the response
//           if (data.isNewUser) {
//             console.log("New user registered with wallet:", walletAddress);
//             // Any special first-time user logic goes here
//           } else {
//             console.log("Returning user identified:", data.userId);
//           }
          
//           // Navigate to chat interface with user ID
//           router.refresh();
//         } else {
//           console.error("Failed to initialize user:", await response.text());
//         }
//       } catch (error) {
//         console.error("Error initializing user:", error);
//       }
//     }
//   };

//   initializeUser();
// }, [isConnected, publicKey, hasInitializedUser, router]);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody >
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 relative z-10">
            <PrivyAuthButton style={{ height: '40px' }} />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <PrivyAuthButton style={{ width: '100%', height: '40px' }} />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
