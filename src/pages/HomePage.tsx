import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { movieService } from "@/api/services/movie"
import type { HomeResponse, MovieListItem } from "@/types/api"
import { MovieCard } from "@/components/MovieCard"
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/image"
import { Loader2, Film, Trophy, Play, Sparkles } from "lucide-react"

/** Banner cao khoảng 1/2 màn hình */
const HERO_HEIGHT = "h-[50vh] min-h-[280px]"

export function HomePage() {
  const [data, setData] = useState<HomeResponse["data"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainItems, setMainItems] = useState<MovieListItem[]>([])
  const [mainPage, setMainPage] = useState(1)
  const [mainTotalPages, setMainTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    movieService
      .getHome()
      .then((res) => {
        const d = res.data.data
        setData(d)
        setMainItems(d.items ?? [])
        setMainPage(1)
        const pagination = d.params?.pagination
        if (pagination) {
          setTotalItems(pagination.totalItems)
          setMainTotalPages(
            Math.ceil(pagination.totalItems / pagination.totalItemsPerPage) || 1
          )
        } else {
          setMainTotalPages(1)
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (data?.seoOnPage?.titleHead) {
      document.title = data.seoOnPage.titleHead
    }
    return () => {
      document.title = "Film Mới - Xem phim online"
    }
  }, [data?.seoOnPage?.titleHead])

  const handleLoadMore = () => {
    if (loadingMore || mainPage >= mainTotalPages) return
    setLoadingMore(true)
    const nextPage = mainPage + 1
    movieService
      .getList("phim-moi-cap-nhat", nextPage)
      .then((res) => {
        const newItems = res.data.data.items ?? []
        setMainItems((prev) => [...prev, ...newItems])
        setMainPage(nextPage)
      })
      .finally(() => setLoadingMore(false))
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Không tải được dữ liệu trang chủ.
      </div>
    )
  }

  const { seoOnPage, itemsSportsVideos, params } = data
  const titleMain = seoOnPage?.titleHead || "Phim mới cập nhật"
  const hasSports = itemsSportsVideos?.length > 0
  const hasMore = mainPage < mainTotalPages
  const heroMovie = mainItems[0]
  const marqueeNames = mainItems.slice(0, 12).map((m) => m.name).join(" • ")
  const remainingCount = totalItems - mainItems.length

  return (
    <div className="space-y-10 pb-8">
      {/* Hero: banner gọn, không chiếm hết màn hình */}
      {heroMovie && (
        <section className="relative rounded-xl overflow-hidden group border border-border">
          <Link to={`/phim/${heroMovie.slug}`} className="block">
            <div className={`${HERO_HEIGHT} w-full relative bg-muted overflow-hidden`}>
              <img
                src={getImageUrl(`movies/${heroMovie.thumb_url}`)}
                alt={heroMovie.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-primary bg-primary/25 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1.5">
                  <Sparkles className="h-3 w-3" />
                  Đang hot
                </span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-lg line-clamp-1">
                  {heroMovie.name}
                </h2>
                <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                  {heroMovie.origin_name} · {heroMovie.year}
                </p>
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-md hover:bg-white/30 transition-colors">
                  <Play className="h-3.5 w-3.5" />
                  Xem ngay
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Marquee */}
      {mainItems.length > 0 && (
        <section className="overflow-hidden border-y border-border bg-muted/30 py-2">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <span className="inline-flex items-center gap-2 px-4 text-sm text-muted-foreground whitespace-nowrap">
              🎬 Mới cập nhật:
            </span>
            <span className="inline-flex px-4 text-sm text-foreground/90 whitespace-nowrap">
              {marqueeNames}
            </span>
            <span className="inline-flex items-center gap-2 px-4 text-sm text-muted-foreground whitespace-nowrap">
              🎬 Mới cập nhật:
            </span>
            <span className="inline-flex px-4 text-sm text-foreground/90 whitespace-nowrap">
              {marqueeNames}
            </span>
          </div>
        </section>
      )}

      {/* Phim mới + Load more + Skeleton */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 border border-primary/20">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {titleMain}
              </h2>
              {params?.itemsUpdateInDay != null && params.itemsUpdateInDay > 0 && (
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-md bg-primary/15 text-primary font-semibold text-xs">
                    {params.itemsUpdateInDay}
                  </span>
                  phim cập nhật trong ngày
                </p>
              )}
            </div>
          </div>
          <Link to="/danh-sach/phim-moi-cap-nhat">
            <Button variant="outline" size="sm" className="shrink-0">
              Xem tất cả
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {mainItems.map((movie, index) => (
            <div
              key={movie._id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${Math.min(index * 40, 600)}ms` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
          {loadingMore &&
            Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
        {hasMore && (
          <div className="flex flex-col items-center gap-2 mt-8">
            {remainingCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Còn khoảng <span className="font-medium text-foreground">{remainingCount.toLocaleString()}</span> phim
              </p>
            )}
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="min-w-[160px] min-h-[44px] h-11 touch-manipulation"
            >
              {loadingMore ? "Đang tải..." : "Load thêm"}
            </Button>
          </div>
        )}
      </section>

      {/* Video thể thao */}
      {hasSports && (
        <section>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 p-3 border border-amber-500/20 dark:from-amber-400/15 dark:to-amber-400/5 dark:border-amber-400/20">
              <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Video thể thao
              </h2>
              {params?.itemsSportsVideosUpdateInDay != null && params.itemsSportsVideosUpdateInDay > 0 && (
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                    {params.itemsSportsVideosUpdateInDay}
                  </span>
                  video trong ngày
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {itemsSportsVideos.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
