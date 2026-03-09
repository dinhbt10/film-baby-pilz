import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { movieService } from "@/api/services/movie"
import type { MovieDetailItem, EpisodeServer, EpisodeServerData } from "@/types/api"
import { getImageUrl } from "@/lib/image"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Film, Calendar, Globe, Clapperboard, List } from "lucide-react"
import { cn } from "@/lib/utils"

const CONTENT_MAX_WIDTH = "max-w-[1600px]"

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [movie, setMovie] = useState<MovieDetailItem | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentServerIndex, setCurrentServerIndex] = useState(0)
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeServerData | null>(null)

  const servers = movie?.episodes ?? []
  const currentServer: EpisodeServer | undefined = servers[currentServerIndex]
  const episodes = currentServer?.server_data ?? []

  const embedUrl = currentEpisode?.link_embed ?? ""

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    movieService
      .getBySlug(slug)
      .then((res) => {
        const data = res.data.data.item
        setMovie(data)
        const eps = data.episodes
        if (eps?.length) {
          setCurrentServerIndex(0)
          const first = eps[0].server_data?.[0]
          setCurrentEpisode(first ?? null)
        } else {
          setCurrentEpisode(null)
        }
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!currentServer?.server_data?.length) return
    setCurrentEpisode(currentServer.server_data[0])
  }, [currentServerIndex])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy phim.</p>
        <Link to="/">
          <Button className="mt-4">Về trang chủ</Button>
        </Link>
      </div>
    )
  }

  const posterUrl = getImageUrl(`movies/${movie.poster_url}`)
  const hasEpisodes = servers.length > 0 && episodes.length > 0

  return (
    <div className={cn("mx-auto w-full px-2 sm:px-4", CONTENT_MAX_WIDTH)}>
      {/* Title + meta - compact */}
      <header className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-2">
          {movie.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2 flex-wrap">
          <Clapperboard className="h-4 w-4 shrink-0" />
          {movie.origin_name}
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-medium">
              {movie.quality}
            </span>
            <span className="text-xs">{movie.lang}</span>
            <span className="text-xs flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {movie.year}
            </span>
            {movie.episode_current && (
              <span className="text-xs">{movie.episode_current}</span>
            )}
          </span>
        </p>
      </header>

      {/* Watch: Video (trái) + Tập phim (phải) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-4 lg:gap-6 mb-8">
        {/* Video - bên trái */}
        <div className="min-w-0 rounded-xl overflow-hidden border border-border bg-card shadow-md">
          <div className="aspect-video w-full bg-black relative">
            {embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={`${movie.name} - ${currentEpisode?.name ?? ""}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="rounded-full bg-muted p-4">
                  <Play className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/70" />
                </div>
                <p className="text-sm font-medium px-4 text-center">
                  {hasEpisodes ? "Chọn tập bên dưới để xem" : "Không có tập phim"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Danh sách tập - bên phải */}
        {hasEpisodes && (
          <div className="flex flex-col min-h-0">
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden flex flex-col flex-1 min-h-[260px] lg:min-h-0 lg:max-h-[calc(100vh-12rem)] lg:sticky lg:top-24">
              <div className="p-3 sm:p-4 border-b border-border bg-muted/30 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <List className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-semibold">Chọn tập</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {servers.map((server, i) => (
                    <button
                      key={server.server_name}
                      type="button"
                      onClick={() => setCurrentServerIndex(i)}
                      className={cn(
                        "px-2.5 py-2 min-h-[44px] rounded-md text-xs font-medium transition-colors touch-manipulation",
                        i === currentServerIndex
                          ? "bg-primary text-primary-foreground shadow"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {episodes.map((ep) => (
                    <button
                      key={ep.slug}
                      type="button"
                      onClick={() => setCurrentEpisode(ep)}
                      className={cn(
                        "min-w-0 min-h-[44px] px-2 py-2.5 rounded-lg text-sm font-medium transition-all text-center truncate touch-manipulation",
                        currentEpisode?.slug === ep.slug
                          ? "bg-primary text-primary-foreground shadow ring-2 ring-primary/40"
                          : "bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Thông tin phim + poster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-4">
          {movie.category?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Thể loại:</span>
              {movie.category.map((c) => (
                <Link
                  key={c._id}
                  to={`/the-loai/${c.slug}`}
                  className="text-sm px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground hover:text-primary transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {movie.country?.length > 0 && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              {movie.country.map((c) => c.name).join(", ")}
            </p>
          )}

          {movie.content && (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-3">
                <Film className="h-4 w-4 text-primary shrink-0" />
                Nội dung
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {movie.content}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="md:sticky md:top-24 rounded-xl overflow-hidden border border-border bg-card shadow-md">
            <img
              src={posterUrl}
              alt={movie.name}
              className="w-full aspect-[2/3] object-cover"
            />
            <div className="p-3 sm:p-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">Poster</p>
              <p className="text-sm mt-0.5 line-clamp-2">{movie.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
