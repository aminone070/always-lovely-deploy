import { CheckCircle2, Layers, Lightbulb, Target } from "lucide-react";
import type { ProjectDetailContent } from "@/data/project-details";
import { useI18n } from "@/lib/i18n";
import { DetailSectionHeader } from "./DetailSectionHeader";

/** Tagline + long-form overview paragraphs. */
export function ProjectOverview({ detail }: { detail: ProjectDetailContent }) {
  const { tr } = useI18n();
  return (
    <section>
      <DetailSectionHeader icon={Layers} title={tr("project.detail.overview")} />
      <p className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl">
        {detail.tagline}
      </p>
      <div className="space-y-5">
        {detail.overview.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-foreground/70 md:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

/** Side-by-side challenge and solution cards. */
export function ProjectChallengeSolution({ detail }: { detail: ProjectDetailContent }) {
  const { tr } = useI18n();
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <NarrativeCard icon={Target} title={tr("project.detail.challenge")} body={detail.challenge} />
      <NarrativeCard
        icon={Lightbulb}
        title={tr("project.detail.solution")}
        body={detail.solution}
      />
    </section>
  );
}

function NarrativeCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Target;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="mb-4 flex items-center gap-3 text-primary">
        <Icon className="size-5" />
        <h3 className="font-display text-sm font-black tracking-widest uppercase">{title}</h3>
      </div>
      <p className="leading-relaxed text-foreground/70">{body}</p>
    </div>
  );
}

/** Numbered feature grid. */
export function ProjectFeatures({ detail }: { detail: ProjectDetailContent }) {
  const { tr } = useI18n();
  return (
    <section>
      <DetailSectionHeader icon={CheckCircle2} title={tr("project.detail.features")} />
      <div className="grid gap-5 sm:grid-cols-2">
        {detail.features.map((feature, index) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
          >
            <div className="mb-3 font-mono text-xs font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="mb-2 font-display text-lg font-black uppercase text-card-foreground">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/60">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
