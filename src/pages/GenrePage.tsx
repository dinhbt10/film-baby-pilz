import { useEffect, useState } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { movieService } from "@/api/services/movie"
import type { MovieListItem } from "@/types/api"
import { MovieCard } from "@/components/MovieCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function GenrePage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const page = Number(searchParams.get("page")) || 1

  const [movies, setMovies] = useState<MovieListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [title, setTitle] = useState("Thể loại")

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    movieService
      .getByGenre(slug, page)
      .then((res) => {
        setMovies(res.data.data.items)
        setTitle(res.data.data.titlePage || slug)
        const pagination = res.data.data.params.pagination
        if (pagination) {
          setTotalPages(Math.ceil(pagination.totalItems / pagination.totalItemsPerPage))
        }
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [slug, page])

  if (loading && movies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => navigate(`/the-loai/${slug}?page=${page - 1}`)}
          >
            Trước
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => navigate(`/the-loai/${slug}?page=${page + 1}`)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}
