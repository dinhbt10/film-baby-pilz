import { CDN_IMAGE_URL } from "@/constants/api"

/** Chuyển path ảnh từ API thành URL đầy đủ */
export function getImageUrl(path: string): string {
  if (!path) return ""
  if (path.startsWith("http")) return path
  const clean = path.startsWith("/") ? path.slice(1) : path
  const base = CDN_IMAGE_URL.endsWith("/") ? CDN_IMAGE_URL : `${CDN_IMAGE_URL}/`
  return `${base}${clean}`
}
