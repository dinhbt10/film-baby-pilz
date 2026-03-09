import { Link } from "react-router-dom"
import type { MovieListItem } from "@/types/api"
import { getImageUrl } from "@/lib/image"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: MovieListItem
  className?: string
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const thumbUrl = getImageUrl(`movies/${movie.thumb_url}`)

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className={cn(
        "group block rounded-lg overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 touch-manipulation active:scale-[0.98]",
        className
      )}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        <img
          src={thumbUrl}
          alt={movie.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/90 text-primary-foreground">
            {movie.quality}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {movie.lang}
          </span>
          {movie.episode_current && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {movie.episode_current}
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {movie.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {movie.origin_name} · {movie.year}
        </p>
      </div>
    </Link>
  )
}
