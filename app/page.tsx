"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/ui/features";
import { Footer } from "@/components/ui/footer";
import { useMobileDetector } from "@/hooks/use-mobile";
import { useUserTracking } from "./context/traking-context";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

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

  useEffect(() => {
    if (mounted) {
      const buttonIds = ["cta-button", "cta-button-mobile", "cta-button-desktop", "cta-button-footer"];
      buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button && !button.hasAttribute('data-fbq-attached')) {
          console.log(`Botón ${id} encontrado por script en index.html`);
          button.addEventListener("click", function () {
            if (typeof window.fbq === 'function') {
              window.fbq("track", "StartTrial", {
                content_name: `Botón ${id} (via index.html)`,
                value: 5,
                currency: "USD",
              });
            }
          });
          button.setAttribute('data-fbq-attached', 'true');
        }
      });
    }
  }, [mounted]);

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
