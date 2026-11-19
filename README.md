# শহরে'র Shondhaz - Your Evenings Sorted

A Kolkata city guide and local business discovery site. Users can sign up, share photo posts, comment and like, list businesses, browse curated top picks and tours, and ask an AI assistant for routes between places. Each route is drawn on an interactive map.

## Features

- **Accounts:** sign up and sign in with a JWT stored in an httpOnly cookie. Passwords are salted and hashed.
- **User posts:** share photos with captions, comment, like, and delete your own posts. The home page shows the latest posts.
- **Businesses:** list a local business with a photo. Businesses are shown in a weekly list.
- **Top picks:** curated Kolkata spots with photo carousels. A map panel draws a default trail using road routes from OSRM.
- **City tours:** a grid of tour cards that link to Tripadvisor search pages.
- **AI assistant:** asks an LLM (default `openai/gpt-oss-120b` via Groq) for suggestions. Places in its replies appear on the map, and numbered lists become routes drawn on the map, with no database writes.

## Tech stack

- **Backend:** Node.js 20+, Express 5, Mongoose (MongoDB Atlas), EJS server-side rendering
- **Frontend:** Bootstrap 5, Leaflet, OSRM routing, marked and DOMPurify for chat rendering
- **Auth and uploads:** JWT in cookies, Multer for image uploads

## Project structure

```
index.js                 App entry point, routes, health check
config/
  index.js               Environment configuration (the only place env vars are read)
  db.js                  MongoDB connection and collection setup
models/                  Mongoose schemas (users, posts, businesses, chatbot data)
routes/                  Express routers (user, user-posts, businesses, chatbot, ...)
middlewares/             Cookie authentication
sevices/                 JWT helpers
data/kolkata-trails.js   Built-in trails and stops (no database needed)
views/                   EJS pages and partials
public/                  CSS, JS, images, and uploaded files
```

## Requirements

- Node.js 20 or newer
- A MongoDB Atlas cluster (the free M0 tier is fine)
- An API key for an OpenAI-compatible LLM provider. The default is [Groq](https://console.groq.com).

## Local setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd Local-Buissness-discovery
   npm install
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env        # Windows PowerShell: copy .env.example .env
   ```
   Fill in the values (see the table below).

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3005.

4. Check the startup log. You should see:
   ```
   [mongo] connected to database "ShohureDB" on ...
   [server] listening on port 3005
   ```

## Environment variables

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/ShohureDB?retryWrites=true&w=majority` | Atlas connection string. Include the database name before the `?`. |
| `JWT_SECRET` | Yes in production | a long random string | Signs login cookies. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |
| `LLM_API_KEY` | For the chatbot | `gsk_...` | API key for the LLM provider. |
| `LLM_BASE_URL` | No | `https://api.groq.com/openai/v1` | OpenAI-compatible endpoint. Use `https://openrouter.ai/api/v1` for OpenRouter. |
| `LLM_MODEL` | No | `openai/gpt-oss-120b` | Model name, as the provider lists it. |
| `CHATBOT_AUTOSAVE` | No | `false` | If `true`, places the AI mentions are saved to the database as unverified records. |
| `PORT` | No | `3005` | Port to listen on. Render sets this automatically. |
| `NODE_ENV` | No | `development` | Set to `production` when deployed. Enables stricter checks and secure cookies. |

If `MONGODB_URI` is missing, the app refuses to start and names the variable. If `JWT_SECRET` is missing in production, it does the same.

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Runs the app once, as production does |
| `npm run dev` | Runs the app and restarts on file changes |

## Health check

`GET /healthz` returns `{"ok":true}` when the database is connected and `503` when it isn't. Render uses this route to check the service.

## Deploying to Render

The repo includes a `render.yaml` blueprint.

1. Push the repo to GitHub.
2. In Render, choose **New → Blueprint** and select the repo.
3. When prompted, enter `MONGODB_URI`, `LLM_API_KEY`, and any other values you want to set. `JWT_SECRET` is generated for you.
4. Deploy, then check the logs for `connected to database "ShohureDB"`.
5. Open `https://<your-service>.onrender.com/healthz` to confirm the service is up.

Before the first deploy, set MongoDB Atlas > Network Access to allow `0.0.0.0/0`. Render's IP addresses change, so a narrower rule will block the connection.

## Troubleshooting

- **`bad auth : authentication failed`**: the username or password in `MONGODB_URI` is wrong, or a second env file (such as `.env.local`) is overriding `.env`. Special characters in the password must be URL-encoded.
- **Data appears in a database called `test`**: the URI has no database name. Add `/ShohureDB` before the `?`.
- **The chatbot says it isn't configured**: `LLM_API_KEY` is missing.
- **`[llm] 401`**: the LLM key is invalid. **`[llm] 404`**: the model name or base URL doesn't match the provider.
- **Collections don't show in Atlas**: the app creates them on startup, so check that the URI points at the database you're looking at.
- **Uploads disappear after a redeploy**: Render's free plan has no persistent disk. Images already committed in `public/uploads` are kept.
- **The first request is slow**: the free Render plan sleeps after about 15 minutes without traffic.

## Known limitations

- Uploaded images are stored on the local disk. Use object storage (Cloudinary, S3) for anything permanent.
- Routing uses OSRM's public demo server, which only serves the driving profile and has no uptime guarantee. If it fails, routes are drawn as dashed straight lines.
- Tour prices and ratings on the city-tours page are placeholders, and the photos come from Unsplash.
- Chatbot rate limiting is per instance and resets on restart.

## Security notes

- Never commit `.env`. It's listed in `.gitignore`.
- Rotate any key that has been pasted into a chat, a screenshot, or a commit.
- Set `JWT_SECRET` to a long random value in production. Changing it signs everyone out.

## Author

**Arindam Samadder**

Designed, developed and managed by Arindam Samadder. Feedback and contributions are welcome through GitHub issues and pull requests.

## License

This project is licensed under the ISC License. See the [`LICENSE`](LICENSE) file for the full text.

To make the license official, add a file named `LICENSE` to the project root with this text, replacing the year and name:

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