// Genre/Category
export interface Genre {
  _id: string
  name: string
  slug: string
}

// Country
export interface Country {
  id: string
  name: string
  slug: string
}

// TMDB/IMDB
export interface TmdbInfo {
  type: "movie" | "tv"
  id: string
  season: number | null
  vote_average: number
  vote_count: number
}

export interface ImdbInfo {
  id: string
  vote_average: number
  vote_count: number
}

// Last episode (for series)
export interface LastEpisode {
  server_name: string
  is_ai: boolean
  name: string
}

// Movie item in list
export interface MovieListItem {
  _id: string
  name: string
  slug: string
  origin_name: string
  type: "single" | "series" | "hoathinh"
  thumb_url: string
  poster_url: string
  sub_docquyen: boolean
  chieurap: boolean
  time: string
  episode_current: string
  quality: string
  lang: string
  lang_key?: string[]
  year: number
  category: Genre[]
  country: Country[]
  alternative_names?: string[]
  modified?: { time: string }
  tmdb?: TmdbInfo
  imdb?: ImdbInfo
  last_episodes?: LastEpisode[]
}

// Pagination
export interface Pagination {
  totalItems: number
  totalItemsPerPage: number
  currentPage: number
  pageRanges: number
}

// List response
export interface MovieListParams {
  type_slug?: string
  filterCategory?: string[]
  filterCountry?: string[]
  filterYear?: string
  filterType?: string
  sortField?: string
  sortType?: string
  pagination?: {
    totalItems: number
    totalItemsPerPage: number
    currentPage: number
    pageRanges: number
  }
}

export interface MovieListResponse {
  status: string
  message: string
  data: {
    seoOnPage?: {
      titleHead: string
      descriptionHead: string
      og_image: string[]
      og_url: string
    }
    breadCrumb?: Array<{ name: string; slug?: string; isCurrent?: boolean; position: number }>
    titlePage: string
    items: MovieListItem[]
    params: MovieListParams
    type_list?: string
    APP_DOMAIN_FRONTEND?: string
    APP_DOMAIN_CDN_IMAGE: string
  }
}

// Episode server data (for detail)
export interface EpisodeServerData {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

export interface EpisodeServer {
  server_name: string
  is_ai: boolean
  server_data: EpisodeServerData[]
}

// Movie detail
export interface MovieDetailItem extends MovieListItem {
  content: string
  status: string
  is_copyright: boolean
  trailer_url: string
  episode_total?: string
  view?: number
  actor: string[]
  director: string[]
  notify?: string
  showtimes?: string
  created?: { time: string }
  episodes: EpisodeServer[]
}

export interface MovieDetailResponse {
  status: string
  message: string
  data: {
    seoOnPage: {
      titleHead: string
      descriptionHead: string
      og_image: string[]
      og_url: string
    }
    breadCrumb: Array<{ name: string; slug?: string; isCurrent?: boolean; position: number }>
    params: { slug: string }
    item: MovieDetailItem
    APP_DOMAIN_CDN_IMAGE: string
  }
}

// Genre list response
export interface GenreListResponse {
  status: string
  message: string
  data: {
    items: Genre[]
  }
}

// Quốc gia (nav từ /v1/api/quoc-gia)
export interface CountryNav {
  _id: string
  name: string
  slug: string
}

export interface CountryListResponse {
  status: string
  message: string
  data: {
    items: CountryNav[]
  }
}

// Home API response (/v1/api/home)
export interface HomeParams {
  type_slug?: string
  filterCategory?: string[]
  filterCountry?: string[]
  filterYear?: string
  sortField?: string
  pagination?: Pagination
  itemsUpdateInDay?: number
  totalSportsVideos?: number
  itemsSportsVideosUpdateInDay?: number
}

export interface HomeResponse {
  status: string
  message: string
  data: {
    seoOnPage: {
      titleHead: string
      descriptionHead: string
      og_type: string
      og_image: string[]
    }
    items: MovieListItem[]
    itemsSportsVideos: MovieListItem[]
    params: HomeParams
    type_list: string
    APP_DOMAIN_FRONTEND?: string
    APP_DOMAIN_CDN_IMAGE: string
  }
}
