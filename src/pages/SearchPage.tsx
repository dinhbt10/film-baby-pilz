import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { movieService } from "@/api/services/movie"
import type { MovieListItem } from "@/types/api"
import { MovieCard } from "@/components/MovieCard"
import { Loader2, Search } from "lucide-react"

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get("q") || ""

  const [movies, setMovies] = useState<MovieListItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) {
      setMovies([])
      return
    }
    setLoading(true)
    movieService
      .search(q)
      .then((res) => setMovies(res.data.data?.items ?? []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Search className="h-6 w-6" />
        Kết quả tìm kiếm: &quot;{q}&quot;
      </h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : movies.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          {q ? "Không tìm thấy phim nào." : "Nhập từ khóa để tìm phim."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
