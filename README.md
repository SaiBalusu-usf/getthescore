# Live Cricket Score Overlay

A lightweight, **frontend‑only** web widget that scrapes live match data from [CricClubs](https://cricclubs.com "CricClubs") and turns it into a clean scoreboard, player stats panel, and ball‑by‑ball commentary feed.  
Use it as a standalone page, drop it into OBS as a browser source for live‑stream overlays, or deploy it to Vercel / GitHub Pages.

---

## ✨ Features

|         | Description |
|---------|-------------|
| 🏏 **Real‑time scoreboard** | Current score, overs, batting & bowling teams – auto‑refreshes every request. |
| 👨‍💻 **Batter & bowler tables** | Highlights on‑strike batter, full spell metrics for the current bowler. |
| 🎙 **Commentary feed** | Styled ball‑by‑ball updates with colour‑coded run badges (dot, 4, 6, W, wd, nb). |
| ⚙️ **Match selector** | Enter any `matchId` (and optionally modify `clubId`) to switch fixtures on the fly. |
| 💻 **Zero‑backend** | Pure HTML + CSS + JS – deploy anywhere that can serve static files. |

---

## 🗂 Project Structure

```
├── index.html   # Mark‑up & minimal inline loader logic
├── style.css    # Responsive UI / theming
└── script.js    # Fetch, parse and render match data
```

---

## 🚀 Quick Start

1. **Clone / download** this repo.

   ```bash
   git clone <your‑fork‑url>
   cd live-cricket-score
   ```

2. **Serve locally** (recommended for CORS‑safe testing). Any static server works – for example:

   ```bash
   npx serve -l 3000 .
   ```

3. **Open** `http://localhost:3000` in your browser.  
   Enter a valid *Match ID* and hit **Load Match**.

> **Note**
> CricClubs blocks direct cross‑origin requests. We use the public CORS proxy **AllOrigins**. If it’s down or rate‑limited, the page will show an error. You can swap in your own proxy or host one yourself.

---

## 🛠 Configuration

| Constant (in `script.js`) | Purpose | Default |
|---------------------------|---------|---------|
| `CLUB_ID`                 | CricClubs club/league identifier | `862` |
| `MATCH_ID`                | Fallback match to load on page open | `677` |
| `PROXY_URL`               | CORS proxy endpoint               | `https://api.allorigins.win/raw?url=` |

Edit these values or expose them via **environment variables**/build step if integrating into a bigger codebase.

---

## 📦 Deployment

### 1. Vercel (recommended)

1. Push the project to GitHub.
2. Import the repo in the [Vercel Dashboard](https://vercel.com/new) → **Framework Preset: Other**.
3. Leave build settings blank (static site).  
   Vercel will auto‑deploy and give you a public URL.

### 2. GitHub Pages

```bash
git checkout -b gh-pages
npm i -g gh-pages   # if not installed
npx gh-pages -d .   # publishes the current folder
```
Visit `https://<username>.github.io/<repo>/`.

### 3. OBS Studio overlay

* In **Sources** → **+** → **Browser**.
* URL: your deployed page or `http://localhost:3000` while testing.
* Custom Resolution: e.g. `1280×250`.
* Toggle **Refresh Browser When Scene Becomes Active** if you only want polling while live.

---

## 🔍 How It Works

1. **Fetch HTML** from `https://cricclubs.com/FT20/ballbyball.do?matchId=<MATCH_ID>&clubId=<CLUB_ID>` through the CORS proxy.
2. **Parse** it with the built‑in `DOMParser` (no external libs needed in the browser).
3. **Extract** score, player rows and commentary via query‑selectors (see functions in `script.js`).
4. **Render** into the DOM – tables and badges are styled by `style.css`.
5. **Refresh**: The user presses **Load Match** – you can wire up an auto‑poll with `setInterval()` if desired.

---

## 🧭 Roadmap / Ideas

- ⏲ Auto‑refresh every X seconds with diff animations.
- 📊 Mini‑charts (worm, run‑rate) using an in‑browser library.
- 🕹 WebSocket bridge → push live data to YouTube overlays without polling.
- 🌐 i18n support & dark‑mode toggle.

---

## 🤝 Contributing

1. Fork ➜ Create a feature branch ➜ Commit ➜ PR.
2. Follow conventional commits (`feat:`, `fix:`, etc.).
3. **Please respect CricClubs’ Terms of Service** and test responsibly.

---

## 📝 License

MIT © 2025 Sai Balusu.  
This project is not affiliated with CricClubs or the cricket boards whose data it displays.

