import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import CinematicHero from "@/components/ui/cinematic-landing-hero";
import LaunchMarquee from "@/components/LaunchMarquee";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Toaster } from "sonner";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-center" theme="light" richColors />
      <CinematicHero />
      <LaunchMarquee />
      <WhatsAppWidget />
    </div>
  );
}

export default App;
