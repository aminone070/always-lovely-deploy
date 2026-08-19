import { AnimatePresence, motion } from "framer-motion";
import type { CredentialItem } from "@/data";
import { EASE } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

interface CredentialSlideMetaProps {
  slide: CredentialItem[];
  activeIdx: number;
  total: number;
  reduce: boolean;
}

/** Section title, slide counter and per-slide metadata. */
export function CredentialSlideMeta({
  slide,
  activeIdx,
  total,
  reduce,
}: CredentialSlideMetaProps) {
  const { tr, lang } = useI18n();

  return (
    <motion.div
      className="flex min-w-0 flex-col gap-6 lg:col-span-4"
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="flex items-end gap-3">
        <span className="pb-3 font-sans text-xs font-black tracking-[0.2em] uppercase text-foreground/60">
          No
        </span>
        <span className="relative inline-block h-[4.5rem] overflow-hidden font-['Oswald',sans-serif] text-[4.5rem] leading-none font-bold">
          {/* Invisible sizer keeps the animated digits from being clipped */}
          <span className="invisible block leading-none" aria-hidden="true">
            {String(total).padStart(2, "0")}
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={activeIdx}
              initial={reduce ? {} : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? {} : { y: -40, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center leading-none text-primary"
            >
              {String(activeIdx + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="pb-2 font-['Oswald',sans-serif] text-2xl font-bold text-foreground/40">
          /{String(total).padStart(2, "0")}
        </span>
      </div>

      <h2 className="font-['Oswald',sans-serif] text-3xl leading-[1.05] font-bold text-balance text-foreground sm:text-4xl lg:text-5xl">
        {tr("awards.title1")}
        <br />
        {tr("awards.title2")}
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeIdx}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="space-y-3"
        >
          <div className="flex flex-wrap gap-2">
            {slide.map((item) => (
              <span
                key={item.id}
                className="rounded-full border border-border bg-foreground/5 px-3 py-1 font-sans text-[10px] font-black tracking-widest uppercase text-foreground/70"
              >
                {item.year}
              </span>
            ))}
          </div>
          <p className="font-sans text-xs leading-relaxed text-foreground/60">
            {slide.map((i) => i.org[lang]).join(" · ")}
          </p>
          <p className="font-sans text-[10px] font-black tracking-[0.2em] uppercase text-foreground/45">
            {slide.length} {tr("awards.itemsLabel")}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
