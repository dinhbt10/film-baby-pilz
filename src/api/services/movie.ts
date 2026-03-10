import { apiClient } from "@/api/client"
import type {
  MovieListResponse,
  MovieDetailResponse,
  GenreListResponse,
  HomeResponse,
  CountryListResponse,
} from "@/types/api"

const DANH_SACH = {
  PHIM_MOI: "phim-moi-cap-nhat",
  HOAT_HINH: "hoat-hinh",
  PHIM_LE: "phim-le",
  PHIM_BO: "phim-bo",
} as const

export type DanhSachType = (typeof DANH_SACH)[keyof typeof DANH_SACH]

export const movieService = {
  /** Danh sách phim (phim-moi-cap-nhat, phim-bo, phim-le, hoat-hinh), có phân trang */
  getList(slug: string = DANH_SACH.PHIM_MOI, page = 1) {
    return apiClient.get<MovieListResponse>(`/danh-sach/${slug}`, {
      params: { page },
    })
  },

  /** Chi tiết phim theo slug */
  getBySlug(slug: string) {
    return apiClient.get<MovieDetailResponse>(`/phim/${slug}`)
  },

  /** Tìm kiếm phim */
  search(keyword: string) {
    return apiClient.get<MovieListResponse>("/tim-kiem", {
      params: { keyword },
    })
  },

  /** Danh sách thể loại */
  getGenres() {
    return apiClient.get<GenreListResponse>("/the-loai")
  },

  /** Phim theo thể loại */
  getByGenre(genreSlug: string, page = 1) {
    return apiClient.get<MovieListResponse>(`/the-loai/${genreSlug}`, {
      params: { page },
    })
  },

  /** Trang chủ - các mục từ API home */
  getHome() {
    return apiClient.get<HomeResponse>("/home")
  },

  /** Danh sách quốc gia (cho nav) */
  getCountries() {
    return apiClient.get<CountryListResponse>("/quoc-gia")
  },

  /** Phim theo quốc gia - GET /v1/api/quoc-gia/[slug] */
  getByCountry(countrySlug: string, page = 1) {
    return apiClient.get<MovieListResponse>(`/quoc-gia/${countrySlug}`, {
      params: { page },
    })
  },
}

export { DANH_SACH }
