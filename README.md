# Film Mới - Web xem phim

Frontend xem phim online sử dụng API [OPhim](https://ophim1.com).

## Công nghệ

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **ShadcnUI** (Radix UI + CVA + tailwind-merge) - UI components
- **Axios** - HTTP client
- **React Router v7** - Routing

## Cấu trúc thư mục

```
src/
├── api/                 # API client & services
│   ├── client.ts        # Axios instance (base URL: ophim1.com)
│   └── services/
│       └── movie.ts     # Movie API (list, detail, search, genre)
├── components/
│   ├── ui/              # Shadcn-style components (Button, Input)
│   ├── layout/          # Header, Footer
│   └── MovieCard.tsx
├── constants/
│   └── api.ts           # API_BASE_URL, CDN_IMAGE_URL
├── layouts/
│   └── MainLayout.tsx
├── lib/
│   ├── utils.ts         # cn() cho classNames
│   └── image.ts         # getImageUrl() - CDN ảnh
├── pages/
│   ├── HomePage.tsx
│   ├── MovieListPage.tsx   # /danh-sach/:slug
│   ├── MovieDetailPage.tsx # /phim/:slug
│   ├── GenrePage.tsx       # /the-loai/:slug
│   └── SearchPage.tsx      # /tim-kiem?q=
├── types/
│   └── api.ts           # Types từ API OPhim
├── App.tsx
├── main.tsx
└── index.css            # Tailwind + CSS variables (theme)
```

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## API base

- **Base:** `https://ophim1.com/v1/api`
- **Ảnh:** `https://img.ophim.live/uploads`

Các endpoint đang dùng: `danh-sach/:slug`, `phim/:slug`, `tim-kiem`, `the-loai`, `the-loai/:slug`.

## Routes

| Route | Mô tả |
|-------|--------|
| `/` | Trang chủ - phim mới cập nhật |
| `/danh-sach/phim-moi-cap-nhat` | Danh sách phim mới |
| `/danh-sach/phim-bo` | Phim bộ |
| `/danh-sach/phim-le` | Phim lẻ |
| `/the-loai/:slug` | Phim theo thể loại (vd: hanh-dong, kinh-di) |
| `/phim/:slug` | Chi tiết phim |
| `/tim-kiem?q=keyword` | Tìm kiếm phim |
