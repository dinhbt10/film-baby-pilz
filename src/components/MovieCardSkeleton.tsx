export function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card animate-pulse">
      <div className="aspect-[2/3] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-4/5" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  )
}
