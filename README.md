# <img width="36" height="24" alt="logo" src="https://github.com/user-attachments/assets/3440520f-725a-4f23-883f-48d2091b2b70" /> শহরে'র Shondhazz  — Local Discovery, Social Feed & AI Route Mapper for Kolkata

> **Your Evenings Sorted.** A full-stack local business discovery platform, social feed, and AI-powered interactive itinerary mapper built for Kolkata.
<img width="1908" height="925" alt="Screenshot 2026-11-20 013419" src="https://github.com/user-attachments/assets/43d8faeb-2f37-4b0c-8912-18fd8889f427" />
<img width="1919" height="969" alt="Screenshot 2026-11-20 014002" src="https://github.com/user-attachments/assets/0320d0d1-116b-432e-bddd-b2355ccf4625" />
<img width="1917" height="976" alt="Screenshot 2026-11-20 014838" src="https://github.com/user-attachments/assets/f0543495-0eb1-4a3d-91a1-cfaf50c355a0" />
<img width="1919" height="959" alt="Screenshot 2026-11-20 013451" src="https://github.com/user-attachments/assets/0abaa795-1543-4277-9e4e-fd2692a18d70" />

🔗 **[Live Demo on Render](https://shohorer-shondhaz.onrender.com)** *(Note: Hosted on Render's free tier—please allow ~30 seconds for the initial cold-start wake-up)*  

🔗 🩺 **[System Health](https://shohorer-shondhaz.onrender.com/healthz)** <- System Health Check

---

## 🎯 Overview

**শহরে'র Shondhaz** solves the problem of fragmented local discovery by combining community-driven recommendations with real-time spatial routing. Users can share local experiences, discover curated neighborhood spots, list local businesses, and chat with an AI local guide that dynamically plots suggested locations and multi-stop walking/driving routes onto an interactive map.

## ✨ Key Engineering Highlights

- **AI-to-Map Spatial Pipeline:** Integrated an OpenAI-compatible LLM (`openai/gpt-oss-120b` via Groq) with Leaflet and OSRM. Place entities mentioned in AI responses are automatically parsed and geocoded onto the map, while numbered itinerary lists are dynamically converted into multi-waypoint road routes—all rendered client-side without unnecessary database writes.
- **Resilient Routing Fallback:** Configured OSRM routing with graceful degradation; if the public routing server times out or fails, the frontend seamlessly falls back to dashed geodesic polylines so the user experience never breaks.
- **Secure Stateless Auth & XSS Protection:** Implemented salted password hashing and `httpOnly` JWT cookie authentication, paired with `marked` and `DOMPurify` to safely sanitize and render LLM-generated Markdown responses.
- **Production-Ready Deployment:** Engineered with centralized environment validation (fail-fast startup checks), health-check endpoints (`/healthz`), and Infrastructure-as-Code via `render.yaml`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express 5, MongoDB Atlas, Mongoose |
| **Frontend** | EJS (SSR), Bootstrap 5, Vanilla JS |
| **Maps & AI** | Leaflet.js, OSRM Routing API, Groq API (`gpt-oss-120b`), Marked, DOMPurify |
| **Auth & Storage** | JWT (`httpOnly` cookies), Multer (multipart image uploads) |
| **DevOps** | Render (Blueprint IaC), Git |

---

## 🚀 Core Features

1. **AI Route Assistant:** Ask for evening plans (e.g., *"Plan a street food trail in North Kolkata"*). The AI responds with curated stops and plots the exact route on the interactive map.
2. **Community Feed:** Full CRUD social feed where authenticated users can upload geo-tagged photo posts, like, and comment.
3. **Local Business Directory:** Dedicated portal for local business owners to list storefronts with photos, featured in a weekly discovery digest.
4. **Curated Trails & Top Picks:** Pre-configured Kolkata heritage and food trails with photo carousels and instant map rendering.

---

## 📂 Architecture & Project Structure

```text
├── index.js                 # App entry point, middleware pipeline, and /healthz endpoint
├── render.yaml              # Render Infrastructure-as-Code deployment blueprint
├── config/
│   ├── index.js             # Centralized, fail-fast environment configuration
│   └── db.js                # MongoDB Atlas connection & collection initialization
├── models/                  # Mongoose schemas (Users, Posts, Businesses, Chatbot logs)
├── routes/                  # Modular Express 5 routers (auth, posts, businesses, AI chat)
├── middlewares/             # JWT cookie verification & Multer upload handlers
├── sevices/                 # Token generation & authentication helpers
├── data/kolkata-trails.js   # Static seed data for zero-latency curated trails
├── views/                   # Server-side rendered EJS templates & partials
└── public/                  # Client-side Leaflet/OSRM logic, CSS, and static assets
```

## 💻 Local Development Setup

### Prerequisites
- **Node.js** `v20+`
- **MongoDB Atlas** cluster (Free M0 tier supported)
- **Groq API Key** (or any OpenAI-compatible provider key)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/Arindam-18s/Shohorer-Shondhazz-v1.git
   cd Local-Buissness-discovery
   npm install

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your credentials:

   | Variable | Required | Description |
   | :--- | :---: | :--- |
   | `MONGODB_URI` | **Yes** | MongoDB Atlas connection string |
   | `JWT_SECRET` | **Yes** | Cryptographic secret for signing cookies |
   | `LLM_API_KEY` | **Yes** | API key for Groq or another OpenAI-compatible LLM provider |
   | `LLM_BASE_URL` | No | Defaults to `[https://api.groq.com/openai/v1](https://api.groq.com/openai/v1)` |
   | `LLM_MODEL` | No | Defaults to `openai/gpt-oss-120b` |
   | `CHATBOT_AUTOSAVE` | No | Set `true` to save AI-discovered places to MongoDB (default: `false`) |
   | `PORT` | No | Server port (defaults to `3005`) |
   | `NODE_ENV` | No | `development` or `production` |

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3005` in your browser.

---

## 🔮 Known Limitations & Future Roadmap

- **Ephemeral File Storage:** Uploaded images are currently written to the local disk (`public/uploads`), which resets on Render redeploys.  
  *Roadmap:* Migrate media storage to **Cloudinary** or **AWS S3**.
- **Public Routing API:** Relies on OSRM's public demo server (driving profile only).  
  *Roadmap:* Integrate Mapbox Directions or a self-hosted OSRM instance for dedicated pedestrian/walking profiles.
- **In-Memory Rate Limiting:** Chatbot rate limits reset upon server restart.  
  *Roadmap:* Move rate-limiting state to **Redis**.

---

## 👨‍💻 Author

**Arindam Samadder**  
Designed, architected, and developed end-to-end.

- **PortFolio:** [@Arindam-S](https://portfolio-murex-phi-81.vercel.app/)
- **LinkedIn:** [Arindam Samadder](https://www.linkedin.com/in/arindam-samadder)
- **Live Project:** [শহরে'র Shondhaz](https://shohorer-shondhaz.onrender.com)

---

## 📄 License

This project is licensed under the **ISC License** — 

```
ISC License

Copyright (c) 2026 Arindam Samadder

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

```
