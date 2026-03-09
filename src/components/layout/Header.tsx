import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, Loader2, Search } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SearchModal } from "@/components/SearchModal"
import { movieService } from "@/api/services/movie"
import type { Genre } from "@/types/api"
import { cn } from "@/lib/utils"

export function Header() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [genresLoading, setGenresLoading] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const genreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setGenresLoading(true)
    movieService
      .getGenres()
      .then((res) => setGenres(res.data.data.items ?? []))
      .catch(() => setGenres([]))
      .finally(() => setGenresLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setGenreOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full my-2 max-w-[1500px] mx-auto flex h-14 items-center gap-4 px-3 sm:px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold shrink-0">
          Nga 🍄
        </Link>
        <nav className="flex flex-1 items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md"
          >
            Trang chủ
          </Link>
          <Link
            to="/phim-be-nga"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md"
          >
            Phim bé Nga
          </Link>
          <Link
            to="/danh-sach/phim-moi-cap-nhat"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md hidden sm:inline"
          >
            Phim mới
          </Link>
          <Link
            to="/danh-sach/phim-bo"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md hidden sm:inline"
          >
            Phim bộ
          </Link>
          <Link
            to="/danh-sach/phim-le"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-md hidden sm:inline"
          >
            Phim lẻ
          </Link>

          {/* Thể loại - dropdown từ API /the-loai */}
          <div className="relative" ref={genreRef}>
            <button
              type="button"
              onClick={() => setGenreOpen((o) => !o)}
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-2 rounded-md transition-colors",
                genreOpen
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-expanded={genreOpen}
              aria-haspopup="true"
            >
              Thể loại
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", genreOpen && "rotate-180")}
              />
            </button>
            {genreOpen && (
              <div className="absolute left-0 top-full mt-1 w-[max(280px,24rem)] max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-card shadow-lg py-2 z-50">
                {genresLoading ? (
                  <div className="flex items-center justify-center py-6 px-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : genres.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 px-4">Chưa có thể loại</p>
                ) : (
                  <ul className="grid grid-cols-3 gap-x-2 gap-y-0.5 px-2">
                    {genres.map((g) => (
                      <li key={g._id}>
                        <Link
                          to={`/the-loai/${g.slug}`}
                          onClick={() => setGenreOpen(false)}
                          className="block text-sm px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors truncate"
                        >
                          {g.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </nav>
        <button
          type="button"
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-1 max-w-sm min-w-0 items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Tìm phim (⌘K hoặc Ctrl+K)"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span>Tìm phim...</span>
          <kbd className="ml-auto text-xs sm:text-sm px-2 py-1 rounded-md bg-muted font-medium border border-border">
            {typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.userAgent) ? "⌘" : "Ctrl"}K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  )
}
