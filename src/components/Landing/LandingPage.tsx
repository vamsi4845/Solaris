"use client";
;import { motion } from "framer-motion";
import { Users, Search, CheckCircle } from "lucide-react";
import { MainNavbar } from "@/components/ui/MainNavbar";
import HeroSection from "../hero-section";

export default function HomePage() {

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
      <HeroSection/>
  );
}