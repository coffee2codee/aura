# AURA ESTATE
React + Vite + Tailwind. Scroll-scrubbed hero video, mock property API (swap-ready for Express + MongoDB).
## Run
`npm install && npm run dev` · build: `npm run build` (output `dist/`)
## Environment
Copy `.env.example` to `.env`. Leave `VITE_API_URL` empty to use the mock data layer (`src/data/properties.js`). Set it to your API origin to use real data.
## API contract (see `src/services/propertyApi.js`)
`GET /api/properties` (`?location=` `?type=` `?featured=true`) · `GET /api/properties/:id` · `POST /api/inquiries`
Property shape: id, title, location, city, price, propertyType, bedrooms, area, description, images[], video, amenities[], status, featured.
## Hero video
`public/media/hero.webm|mp4` is a **generated placeholder**. Replace with your footage, encoded all-keyframe for smooth scrubbing:
`ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -g 1 -crf 28 -an -movflags +faststart public/media/hero.mp4` (and `-c:v libvpx-vp9 -g 1 -crf 36 -b:v 0` for webm). Replace `poster.png` with a frame from it.
## Deploy to Cloudflare Pages
Push to GitHub → Cloudflare Pages → Create project → framework **Vite**, build command `npm run build`, output `dist`, set `VITE_API_URL` under Environment variables. `public/_redirects` handles SPA routing.
## Your images & video
Replace these files (same names) — the current ones are placeholders:
`src/images/image1.png`, `image2.png`, `image3.png` · `src/videos/hero.mp4` (background video, autoplay/loop/muted; keep it ≲ 8 MB, 1080p).
## AI chatbot
`src/components/Chatbot.jsx` works out of the box with a built-in real-estate assistant (property search, EMI, stamp duty, RERA, visit booking). For a real LLM, expose `POST /api/chat` (`{messages}` → `{reply}`) from your Express server (keep the API key there) and set `VITE_CHAT_API_URL`.
