import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/layouts/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { MovieListPage } from "@/pages/MovieListPage"
import { MovieDetailPage } from "@/pages/MovieDetailPage"
import { SearchPage } from "@/pages/SearchPage"
import { GenrePage } from "@/pages/GenrePage"
import { PhimBeNgaPage } from "@/pages/PhimBeNgaPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="phim-be-nga" element={<PhimBeNgaPage />} />
          <Route path="danh-sach/:slug" element={<MovieListPage />} />
          <Route path="phim/:slug" element={<MovieDetailPage />} />
          <Route path="the-loai/:slug" element={<GenrePage />} />
          <Route path="tim-kiem" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
