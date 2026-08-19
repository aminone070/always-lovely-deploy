import type { ProjectHighlight } from "@/data/project-details";

/** "At a glance" metric strip. */
export function ProjectHighlights({ highlights }: { highlights: ProjectHighlight[] }) {
  return (
    <div className="mb-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {highlights.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="mb-2 text-[10px] font-black tracking-widest uppercase text-foreground/50">
            {item.label}
          </div>
          <div className="font-display text-lg font-black uppercase text-card-foreground md:text-xl">
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
