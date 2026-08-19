import { X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectGridSkeleton } from "@/components/ui/Skeletons";
import { useI18n } from "@/lib/i18n";
import { useProjectsExplorer } from "@/hooks/useProjectsExplorer";
import { ProjectFilterChips } from "./ProjectFilterChips";
import { ProjectsPagination } from "./ProjectsPagination";
import { ProjectsResults } from "./ProjectsResults";
import { ProjectsToolbar } from "./ProjectsToolbar";

/** Full projects browsing experience: search, filters, sorting, pagination. */
export function ProjectsExplorer() {
  const { tr } = useI18n();
  const explorer = useProjectsExplorer();

  return (
    <section className="pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <header className="mb-8 max-w-2xl text-center md:text-start">
            <span className="rounded-xl bg-foreground/10 px-3 py-1 font-sans text-[11px] font-black tracking-[0.25em] text-primary uppercase border border-border inline-block mb-2">
              {tr("projects.index.eyebrow")}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
              {tr("projects.index.title")}
            </h1>
            <p className="mt-2 font-sans text-sm text-foreground/90">{tr("projects.index.desc")}</p>
          </header>
        </Reveal>

        <ProjectsToolbar
          searchQuery={explorer.searchQuery}
          onSearchChange={explorer.setSearchQuery}
          sort={explorer.sort}
          onSortChange={explorer.setSort}
          view={explorer.view}
          onViewChange={explorer.setView}
        />

        <ProjectFilterChips
          filter={explorer.filter}
          onChange={explorer.setFilter}
          counts={explorer.counts}
        />

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-foreground/90 font-medium">
          <p>
            {tr("projects.index.showing")}{" "}
            <span className="font-bold text-foreground">{explorer.filtered.length}</span>{" "}
            {tr("projects.index.projectsWord")}
            {explorer.totalPages > 1 &&
              ` · ${tr("projects.index.page")} ${explorer.page} / ${explorer.totalPages}`}
          </p>
          {explorer.hasActiveFilters && (
            <button
              onClick={explorer.reset}
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground/10 border border-border px-4 py-1.5 font-sans text-xs font-black tracking-wider uppercase text-foreground hover:bg-foreground/20 transition-colors"
            >
              <X className="size-3.5 text-primary" />
              {tr("projects.index.reset")}
            </button>
          )}
        </div>

        {explorer.isFiltering ? (
          <ProjectGridSkeleton count={explorer.perPage} view={explorer.view} />
        ) : explorer.paginated.length > 0 ? (
          <>
            <h2 className="sr-only">{tr("projects.index.results")}</h2>
            <ProjectsResults
              projects={explorer.paginated}
              view={explorer.view}
              sort={explorer.sort}
            />
            <ProjectsPagination
              page={explorer.page}
              totalPages={explorer.totalPages}
              onPageChange={explorer.setCurrentPage}
            />
          </>
        ) : (
          <EmptyState message={tr("projects.index.empty")} />
        )}
      </div>
    </section>
  );
}
