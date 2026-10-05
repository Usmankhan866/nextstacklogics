import { motion } from "framer-motion";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { NexMark } from "@/components/NexMark";
import { WhatsAppIcon } from "@/components/WhatsAppWidget";

const XIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
  </svg>
);

// Placeholder URLs until the real profiles are live.
const SOCIALS = [
  { label: "LinkedIn", href: "#", Icon: Linkedin },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "X (Twitter)", href: "#", Icon: XIcon },
  { label: "WhatsApp", href: "https://wa.me/61470492564", Icon: WhatsAppIcon, external: true },
];

const SERVICES = [
  "Web & App Development",
  "Cybersecurity & Auditing",
  "Shopify & E-Commerce",
  "WordPress · Wix · Squarespace",
  "Meta Ads & Growth",
  "Cloud & DevOps",
  "AI & Automation",
];

export const LaunchMarquee = () => {
  return (
    <section className="relative z-10 border-t border-slate-900/5 bg-background py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-center text-[11px] font-mono uppercase tracking-[0.35em] text-cyan-600/80 mb-12">
          Full-Stack Tech Capabilities
        </p>

        <div className="relative w-full overflow-hidden" data-testid="service-marquee">
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div className="flex items-center" key={copy} aria-hidden={copy === 1}>
                {SERVICES.map((service, i) => (
                  <div className="flex items-center shrink-0" key={`${copy}-${i}`}>
                    <span className="font-display text-2xl md:text-4xl font-bold tracking-tight text-slate-800 whitespace-nowrap px-8">
                      {service}
                    </span>
                    <NexMark className="w-5 h-5 md:w-6 md:h-6 text-cyan-600/70 shrink-0" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
        </div>
      </motion.div>

      <footer className="mt-20 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2.5">
          <NexMark className="w-4 h-4 text-slate-500" />
          <span data-testid="footer-copyright">
            © {new Date().getFullYear()} NexStack Logics. All rights reserved.
          </span>
        </div>
        <nav aria-label="Social media" className="flex items-center gap-2" data-testid="footer-socials">
          {SOCIALS.map(({ label, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/10 text-slate-500 transition hover:border-cyan-600/40 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </nav>
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          Empower Today. Own Tomorrow.
        </span>
      </footer>
    </section>
  );
};

export default LaunchMarquee;
