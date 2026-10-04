import { motion } from "framer-motion";
import { NexMark } from "@/components/NexMark";

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
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          Empower Today. Own Tomorrow.
        </span>
      </footer>
    </section>
  );
};

export default LaunchMarquee;
