"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Search, CheckCircle } from "lucide-react";
import { useWalletStatus } from "@/hooks/useWalletStatus";
import { MainNavbar } from "@/components/ui/MainNavbar";

export default function HomePage() {
  const router = useRouter();
  const { isConnected } = useWalletStatus();

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col gap-2 min-h-screen bg-[url('/bg3.png')] dark:from-background dark:to-slate-900 p-4">
      <MainNavbar />
      <main className="flex-1">
        <motion.section 
          className="container mx-auto max-w-4xl text-center py-20 md:py-32 px-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6  bg-clip-text text-white"
            variants={FADE_IN_VARIANTS}
          >
            Find Your Perfect Hackathon Team
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            variants={FADE_IN_VARIANTS}
          >
            Connect with passionate developers, designers, and innovators.
            Build winning teams based on complementary skills and shared interests.
          </motion.p>
        </motion.section>

        <motion.section 
          className="container mx-auto max-w-5xl py-16 md:py-24 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Create Your Profile",
                description: "Showcase your skills, experience, and availability for hackathon events."
              },
              {
                icon: <Search className="h-8 w-8 text-primary" />,
                title: "Find Teammates",
                description: "Search for teammates with complementary skills for your next project."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-primary" />,
                title: "Collaborate & Win",
                description: "Connect, message, and start building amazing projects together."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="bg-card p-6 rounded-xl shadow-lg border border-border/50 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
                variants={FADE_IN_VARIANTS}
              >
                <div className="bg-primary/10 p-4 rounded-full mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="border-t  backdrop-blur-sm px-6 py-8 mt-16">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HackMate. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}