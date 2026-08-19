import type { ProjectHighlight } from "@/data/project-details";

/** "At a glance" metric strip. */
export function ProjectHighlights({ highlights }: { highlights: ProjectHighlight[] }) {
  return (
    <div className="mb-16 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {highlights.map((item) => (
        <div
          key={item.label}
          className="min-w-0 rounded-2xl border border-border bg-card p-4 md:p-6"
        >
          <div className="mb-2 text-[10px] font-black tracking-widest uppercase text-foreground/50">
            {item.label}
          </div>
          <div className="font-display text-base leading-tight font-black uppercase text-card-foreground [overflow-wrap:anywhere] sm:text-lg md:text-xl">
            {item.value}
          </div>

          {item.hint && (
            <div dir="ltr" className="mt-1.5 text-xs text-foreground/50 keep-latin">
              {item.hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
