import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { movieService } from "@/api/services/movie"
import type { MovieListItem } from "@/types/api"
import { getImageUrl } from "@/lib/image"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  open: boolean
  onClose: () => void
  initialKeyword?: string
}

function SearchSkeleton() {
  return (
    <div className="space-y-1 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-lg border border-border bg-card p-2 animate-pulse"
        >
          <div className="w-16 h-24 shrink-0 rounded bg-muted" />
          <div className="flex-1 min-w-0 space-y-2 py-1">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchModal({ open, onClose, initialKeyword = "" }: SearchModalProps) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const [results, setResults] = useState<MovieListItem[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    movieService
      .search(q.trim())
      .then((res) => setResults(res.data.data?.items ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setKeyword(initialKeyword)
  }, [initialKeyword])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    if (keyword.trim()) fetchSearch(keyword)
    else setResults([])
  }, [open])

  useEffect(() => {
    const t = setTimeout(() => {
      if (open) fetchSearch(keyword)
    }, 350)
    return () => clearTimeout(t)
  }, [keyword, open, fetchSearch])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-3 sm:px-4 min-h-screen min-w-full">
      <div
        className="absolute inset-0 min-h-full min-w-full bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-2xl max-h-[75vh] flex flex-col rounded-xl border border-border bg-card shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm phim"
      >
        <div className="p-3 border-b border-border shrink-0 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="search"
              placeholder="Tìm phim..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-10 flex-1"
              autoComplete="off"
            />
            <Button type="button" variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <span>Mở nhanh:</span>
            <kbd className="text-xs sm:text-sm px-2 py-1 rounded-md bg-muted font-medium border border-border">
              {typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.userAgent) ? "⌘" : "Ctrl"}K
            </kbd>
            <span className="text-border">·</span>
            <span>Đóng:</span>
            <kbd className="text-xs sm:text-sm px-2 py-1 rounded-md bg-muted font-medium border border-border">
              ESC
            </kbd>
          </p>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading && <SearchSkeleton />}
          {!loading && keyword.trim() && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">
              Không tìm thấy phim nào.
            </p>
          )}
          {!loading && !keyword.trim() && (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">
              Nhập từ khóa để tìm phim.
            </p>
          )}
          {!loading && results.length > 0 && (
            <ul className="space-y-1 p-3">
              {results.map((movie) => (
                <li key={movie._id}>
                  <Link
                    to={`/phim/${movie.slug}`}
                    onClick={onClose}
                    className={cn(
                      "group flex gap-3 rounded-lg border border-border bg-card/80 p-2",
                      "hover:border-primary/50 hover:bg-muted/50 transition-all"
                    )}
                  >
                    <div className="w-16 h-24 shrink-0 rounded overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(`movies/${movie.thumb_url}`)}
                        alt={movie.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {movie.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {movie.origin_name} · {movie.year}
                      </p>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                          {movie.quality}
                        </span>
                        <span className="text-xs text-muted-foreground">{movie.episode_current}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )

  return typeof document !== "undefined" ? createPortal(modal, document.body) : null
}
