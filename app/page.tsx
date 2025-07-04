"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Hero } from "@/components/ui/hero";
import { Features } from "@/components/ui/features";
import { Footer } from "@/components/ui/footer";
import { useMobileDetector } from "@/hooks/use-mobile";
import { useUserTracking } from "./context/traking-context";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMobileDetector();
  const { incrementPageViews, trackingData } = useUserTracking();

  useEffect(() => {
    setMounted(true);
    // Incrementar page views cuando la página se monte
    incrementPageViews();
    console.log('Tracking inicializado:', trackingData);
  }, [incrementPageViews, trackingData]);

  //anda

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
