import { cn } from "@/lib/utils";

type TagProps = React.ComponentPropsWithoutRef<"span">;

/** Small uppercase pill used for categories, types and status labels. */
export function Tag({ children, className, ...rest }: TagProps) {
  return (
    <span
      {...rest}
      className={cn(
        "rounded-xl bg-primary px-3 py-1 font-sans text-[10px] font-black tracking-widest text-primary-foreground uppercase shadow-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
