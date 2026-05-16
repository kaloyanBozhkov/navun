import { Badge as ShadcnBadge } from "@/app/_components/shadcn/badge";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<typeof ShadcnBadge> & {
  category?: boolean;
};

function Badge({ category, className, ...props }: BadgeProps) {
  return (
    <ShadcnBadge
      className={cn(
        category && "rounded-full px-3 py-1 text-xs font-medium",
        className
      )}
      {...props}
    />
  );
}

export { Badge, type BadgeProps };
