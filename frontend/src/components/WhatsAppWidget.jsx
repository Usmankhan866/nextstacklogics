import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { NexMark } from "@/components/NexMark";

// Australian number +61 470 492 564, in wa.me format (digits only).
const WHATSAPP_NUMBER = "61470492564";
const DEFAULT_MESSAGE = "Hi NexStack Logics, I'd like to talk about a project.";

export const WhatsAppIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.44 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.07c0 2 .52 3.96 1.52 5.68L.58 23.3l5.68-1.49a11.36 11.36 0 0 0 5.78 1.47h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
  </svg>
);

export const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.trim() || DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[80] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="wa-panel"
            role="dialog"
            aria-label="Chat with NexStack Logics on WhatsApp"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(340px,calc(100vw-2.5rem))] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/5"
            data-testid="whatsapp-panel"
          >
            <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3.5 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <NexMark className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 leading-tight">
                <p className="font-semibold text-sm">NexStack Logics</p>
                <p className="text-xs text-white/75">Typically replies within a few hours</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close WhatsApp chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-[#ECE5DD] px-4 py-5">
              <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                Hi there 👋 How can we help you today?
              </div>
            </div>

            <form
              className="flex items-end gap-2 border-t border-slate-100 bg-white p-3"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(href, "_blank", "noopener,noreferrer");
              }}
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20"
                aria-label="Your message"
                data-testid="whatsapp-message"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe5b]"
                aria-label="Send on WhatsApp"
                data-testid="whatsapp-send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40"
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        data-testid="whatsapp-toggle"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />}
        {open ? <X className="relative h-6 w-6" /> : <WhatsAppIcon className="relative h-7 w-7" />}
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;
