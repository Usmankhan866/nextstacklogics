import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { toast } from "sonner";
import {
  Rocket,
  ShieldCheck,
  Flame,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NexMark } from "@/components/NexMark";

gsap.registerPlugin(ScrollTrigger);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image:
          linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .transform-style-3d { transform-style: preserve-3d; }

  .text-3d-matte {
      color: #F8FAFC;
      text-shadow:
          0 10px 30px rgba(148, 197, 255, 0.20),
          0 2px 4px rgba(148, 197, 255, 0.10);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #F8FAFC 0%, rgba(248, 250, 252, 0.4) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 10px 20px rgba(148, 197, 255, 0.15))
          drop-shadow(0px 2px 4px rgba(148, 197, 255, 0.10));
  }

  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card {
      background: linear-gradient(145deg, #162C6D 0%, #0A101D 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
      background-color: #111;
      box-shadow:
          inset 0 0 0 2px #52525B,
          inset 0 0 0 7px #000,
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow:
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  .btn-modern-light {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export const CinematicHero = ({
  brandName = "NEXSTACK",
  tagline1 = "Empower Today.",
  tagline2 = "Own Tomorrow.",
  cardHeading = "Every tech service. One stack.",
  cardDescription = (
    <>
      <span className="text-white font-semibold">NexStack Logics</span> builds,
      secures and scales your entire digital presence — web & app development,
      e-commerce on Shopify, WordPress, Wix & Squarespace, cybersecurity, Meta
      ads, cloud and beyond. One team for every tech service.
    </>
  ),
  metricValue = 6,
  metricLabel = "Core Verticals",
  ctaHeading = "Be first in line.",
  ctaDescription = "NexStack Logics is launching soon. Drop your email and be the first to know when every tech service we offer goes live.",
  className,
  ...props
}) => {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setFeedback("");
    try {
      const { data } = await axios.post(`${API}/subscribe`, { email });
      setStatus("success");
      setFeedback(data.message);
      toast.success(data.message);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Something went wrong. Please try again.";
      setStatus("error");
      setFeedback(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", {
        autoAlpha: 0,
        y: 60,
        scale: 0.85,
        filter: "blur(20px)",
        rotationX: -20,
      });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set(
        [".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"],
        { autoAlpha: 0 }
      );
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", {
          duration: 1.8,
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          rotationX: 0,
          ease: "expo.out",
        })
        .to(
          ".text-days",
          { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" },
          "-=1.0"
        );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(
          [".hero-text-wrapper", ".bg-grid-theme"],
          { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 },
          0
        )
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", {
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        .fromTo(
          ".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 },
          "-=0.8"
        )
        .fromTo(
          ".phone-widget",
          { y: 40, autoAlpha: 0, scale: 0.95 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 },
          "-=1.5"
        )
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(
          ".counter-val",
          { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" },
          "-=2.0"
        )
        .fromTo(
          ".floating-badge",
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
          { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 },
          "-=2.0"
        )
        .fromTo(
          ".card-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5"
        )
        .fromTo(
          ".card-right-text",
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<"
        )
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to(
          [".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          }
        )
        .to(
          ".main-card",
          {
            width: isMobile ? "92vw" : "85vw",
            height: isMobile ? "92vh" : "85vh",
            borderRadius: isMobile ? "32px" : "40px",
            ease: "expo.inOut",
            duration: 1.8,
          },
          "pullback"
        )
        .to(
          ".cta-wrapper",
          { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 },
          "pullback"
        )
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background text-foreground font-sans antialiased",
        className
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(10,25,60,0.85)_0%,transparent_65%)]"
        aria-hidden="true"
      />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* Fixed brand header */}
      <header className="fixed top-0 inset-x-0 z-[60] flex items-center justify-between px-5 md:px-10 py-4 pointer-events-none">
        <div data-testid="brand-logo" className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-lg shadow-black/40">
            <NexMark className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-extrabold tracking-tight text-white text-base">
              NexStack
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-cyan-300/70">
              Logics
            </div>
          </div>
        </div>
        <div
          data-testid="nav-launch-badge"
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/80 shadow-lg shadow-black/40"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          Launching Soon
        </div>
      </header>

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1
          data-testid="hero-headline"
          className="text-track gsap-reveal text-3d-matte font-display text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tight mb-2"
        >
          {tagline1}
        </h1>
        <h1
          data-testid="hero-tagline"
          className="text-days gsap-reveal text-silver-matte font-display text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tight"
        >
          {tagline2}
        </h1>
      </div>

      {/* BACKGROUND LAYER 2: Notify CTA */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <div
          data-testid="cta-launch-badge"
          className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-300 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          Launching Soon
        </div>
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>

        <form
          data-testid="subscribe-form"
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-lg mx-auto"
        >
          <input
            data-testid="subscribe-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-label="Email address"
            className="w-full sm:flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4 text-base text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30 transition-all shadow-lg shadow-black/40"
          />
          <button
            data-testid="subscribe-submit-button"
            type="submit"
            disabled={status === "loading"}
            className="btn-modern-light rounded-2xl px-8 py-4 font-display font-bold text-base inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
          >
            {status === "loading" ? "Joining..." : "Notify Me"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 min-h-[28px]">
          {status === "success" && (
            <p
              data-testid="subscribe-success-message"
              className="inline-flex items-center gap-2 text-sm md:text-base text-cyan-300 font-medium"
            >
              <CheckCircle2 className="w-4 h-4" /> {feedback}
            </p>
          )}
          {status === "error" && (
            <p data-testid="subscribe-error-message" className="text-sm md:text-base text-red-400 font-medium">
              {feedback}
            </p>
          )}
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Deep Blue Card */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ perspective: "1500px" }}
      >
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            {/* 1. TOP (Mobile) / RIGHT (Desktop): BRAND NAME */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="font-display text-6xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0">
                {brandName}
              </h2>
            </div>

            {/* 2. MIDDLE (Mobile) / CENTER (Desktop): IPHONE MOCKUP */}
            <div
              className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10"
              style={{ perspective: "1000px" }}
            >
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-[0.85] lg:scale-100">
                <div
                  ref={mockupRef}
                  data-testid="phone-mockup-container"
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse" />
                    </div>

                    {/* NexStack dashboard */}
                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      <div className="phone-widget flex justify-between items-center mb-8" data-testid="phone-header-widget">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                            NexStack HQ
                          </span>
                          <span className="font-display text-xl font-bold tracking-tight text-white drop-shadow-md">
                            Dashboard
                          </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-black/50 flex items-center justify-center">
                          <NexMark className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div
                        className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                        data-testid="dashboard-stats-widget"
                      >
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#00F0FF" strokeWidth="12" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val font-display text-4xl font-extrabold tracking-tighter text-white">
                            0
                          </span>
                          <span className="text-[8px] text-cyan-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">
                            {metricLabel}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center" data-testid="dashboard-projects-widget">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 flex items-center justify-center mr-3 border border-cyan-400/20 shadow-inner">
                            <Rocket className="w-4 h-4 text-cyan-300 drop-shadow-md" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-white tracking-tight">
                              140+ Projects Delivered
                            </div>
                            <div className="text-[9px] text-cyan-200/40 font-medium">
                              Web · App · Cloud
                            </div>
                          </div>
                        </div>
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center" data-testid="dashboard-clients-widget">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mr-3 border border-emerald-400/20 shadow-inner">
                            <ShieldCheck className="w-4 h-4 text-emerald-300 drop-shadow-md" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[11px] font-bold text-white tracking-tight">
                              98.8% Client Retention
                            </div>
                            <div className="text-[9px] text-emerald-200/40 font-medium">
                              Security-first delivery
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badges */}
                <div
                  className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30"
                  data-testid="floating-badge-stack"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-cyan-500/20 to-cyan-900/10 flex items-center justify-center border border-cyan-400/30 shadow-inner">
                    <Flame className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-300 drop-shadow-lg" />
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Full-Stack Crew</p>
                    <p className="text-cyan-200/50 text-[10px] lg:text-xs font-medium">6 verticals, one team</p>
                  </div>
                </div>

                <div
                  className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30"
                  data-testid="floating-badge-portal"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-indigo-500/20 to-indigo-900/10 flex items-center justify-center border border-indigo-400/30 shadow-inner">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-300 drop-shadow-lg" />
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Client Portal</p>
                    <p className="text-indigo-200/50 text-[10px] lg:text-xs font-medium">Live project updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. BOTTOM (Mobile) / LEFT (Desktop): POSITIONING TEXT */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="font-display text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
