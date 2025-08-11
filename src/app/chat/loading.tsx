import { Skeleton } from "@/shared/components/ui/skeleton"
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}