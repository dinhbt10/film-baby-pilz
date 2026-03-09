import { useEffect, useState } from "react"
import { movieService } from "@/api/services/movie"
import type { MovieListItem } from "@/types/api"
import { MovieCard } from "@/components/MovieCard"
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const SECTIONS = [
  {
    id: "conan",
    title: "Thám tử lừng danh Conan",
    keyword: "Thám tử lừng danh Conan",
    icon: "🔍",
    gradient: "from-rose-500/15 to-amber-500/10",
    borderColor: "border-rose-500/20",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
  {
    id: "doraemon",
    title: "Doraemon",
    keyword: "Doraemon",
    icon: "🐱",
    gradient: "from-sky-500/15 to-blue-500/10",
    borderColor: "border-sky-500/20",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
  {
    id: "ghibli",
    title: "Ghibli",
    keyword: "Ghibli",
    icon: "🎬",
    gradient: "from-emerald-500/15 to-teal-500/10",
    borderColor: "border-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
] as const

function SectionBlock({
  title,
  icon,
  gradient,
  borderColor,
  badge,
  children,
  loading,
  count,
}: {
  title: string
  icon: string
  gradient: string
  borderColor: string
  badge: string
  children: React.ReactNode
  loading: boolean
  count: number
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card overflow-hidden shadow-sm",
        `bg-gradient-to-br ${gradient}`,
        borderColor
      )}
    >
      <div className="p-4 sm:p-6 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl" aria-hidden>{icon}</span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Phim hay cho bé Nga 🍄
            </p>
          </div>
          <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full shrink-0", badge)}>
            {loading ? "Đang tải..." : `${count} phim`}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  )
}

export function PhimBeNgaPage() {
  const [data, setData] = useState<Record<string, MovieListItem[]>>({
    conan: [],
    doraemon: [],
    ghibli: [],
  })
  const [loading, setLoading] = useState<Record<string, boolean>>({
    conan: true,
    doraemon: true,
    ghibli: true,
  })

  useEffect(() => {
    SECTIONS.forEach((section) => {
      movieService
        .search(section.keyword)
        .then((res) => {
          setData((prev) => ({
            ...prev,
            [section.id]: res.data.data?.items ?? [],
          }))
        })
        .catch(() => {
          setData((prev) => ({ ...prev, [section.id]: [] }))
        })
        .finally(() => {
          setLoading((prev) => ({ ...prev, [section.id]: false }))
        })
    })
  }, [])

  const allLoading = Object.values(loading).every(Boolean)

  if (allLoading && Object.values(data).every((arr) => arr.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải phim cho bé Nga...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-semibold">Phim bé Nga</span>
          <span className="text-2xl" aria-hidden>🍄</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Phim hoạt hình hay cho bé
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Conan, Doraemon, Ghibli và nhiều phim hoạt hình đặc sắc — chọn mục bên dưới để xem.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <SectionBlock
            key={section.id}
            title={section.title}
            icon={section.icon}
            gradient={section.gradient}
            borderColor={section.borderColor}
            badge={section.badge}
            loading={loading[section.id]}
            count={data[section.id]?.length ?? 0}
          >
            {data[section.id]?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {data[section.id].map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground text-sm">
                Chưa có phim nào trong mục này.
              </p>
            )}
          </SectionBlock>
        ))}
      </div>
    </div>
  )
}
