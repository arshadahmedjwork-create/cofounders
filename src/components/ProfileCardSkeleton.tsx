import { Skeleton } from "@/components/ui/skeleton";

export function ProfileCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 relative">
      <div className="absolute top-4 right-4 w-12 h-12 rounded-full">
        <Skeleton className="w-full h-full rounded-full" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="flex gap-1.5 mb-3">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>

      <div className="space-y-1.5 mb-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      <Skeleton className="h-3 w-32 mb-4" />

      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}
