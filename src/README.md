# AURA ESTATE
React + Vite + Tailwind. Scroll-driven hero video, mock property data, working enquiry emails.

## Run
`npm install && npm run dev` · build: `npm run build` (output in `dist/`)

## How the hero works
On load, the hero video is played quickly in the background and turned into about 120 still frames (72 on phones). The loader shows real progress while this happens. Scrolling then picks and blends frames, so it runs smoothly forwards and backwards with any video file. No special encoding needed. It is skipped when the user prefers reduced motion or has Data Saver on.

## Enquiry emails
The enquiry form sends an email to `jia3.harisinghani@gmail.com` through FormSubmit (no backend needed). Change the address with `VITE_ENQUIRY_EMAIL`.
First time only: submit the form once, then open the "Activate FormSubmit" email in that inbox and confirm. Check spam too. After that every enquiry arrives as a table with name, email, phone, interest, message and the page it came from.

## Environment
Copy `.env.example` to `.env`. Leave `VITE_API_URL` empty to use the mock data in `src/data/properties.js`.

## API contract (optional, see `src/services/propertyApi.js`)
`GET /api/properties` (`?location=` `?type=` `?featured=true`) · `GET /api/properties/:id` · `POST /api/inquiries`

## Your images and video
Replace these files (same names): `src/images/image1.png`, `image2.png`, `image3.png`, `image4.png`, `src/videos/hero.mp4` (keep it under 8 MB, 1080p or less), and `public/media/poster.jpg`.

## Chatbot
`src/data/chatEngine.js` answers real estate questions on its own (homes, EMI, eligibility, stamp duty, RERA, taxes, documents, NRI, rent vs buy, visits) and declines everything else. For a real LLM, expose `POST /api/chat` (`{system, messages}` → `{reply}`) and set `VITE_CHAT_API_URL`. Off-topic messages never reach it.

## Deploy to Cloudflare Pages
Push to GitHub, create a Pages project, framework **Vite**, build command `npm run build`, output `dist`. `public/_redirects` handles routing.
