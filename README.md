# Par Avion — Language Translation Tool

**Par Avion** is a clean, fast, browser-based translation tool. Type or paste any text, choose a source and target language, and get an instant translation — no sign-up, no installation, and no API key required for the person using it.

The name comes from the old "par avion" airmail stamp used on international letters — a small nod to what this tool does: it sends your words abroad and brings a translation back. This project was completed as part of CodeAlpha internship program. 

🔗 **Live demo:** _add your deployed link here after following the steps below_

---

## What this tool does

- **Translate text between 14 languages**, including English, Urdu, Spanish, French, German, Arabic, Hindi, Chinese, Japanese, Korean, Russian, Portuguese, Italian, and Turkish.
- **Swap languages** instantly with one click, along with the text in both boxes.
- **Listen to either box** using the browser's built-in text-to-speech, in the correct accent/locale for that language.
- **Copy the translation** to your clipboard in one click.
- **Keyboard shortcut** — press `Cmd/Ctrl + Enter` to translate without touching the mouse.
- **Clear feedback** — a loading state while translating, and plain-language error messages if something goes wrong (e.g. empty input, network issue).

## Why this approach (advantages)

- **No backend, no server costs.** It's a static site — it can be hosted for free on GitHub Pages, Netlify, or Vercel.
- **No API key management.** It calls the free, public [MyMemory Translation API](https://mymemory.translated.net/) directly from the browser, so there's nothing to configure or keep secret.
- **Fast to load and use.** Built with [Vite](https://vitejs.dev/), which produces a small, optimized bundle.
- **Accessible design.** Proper labels on all icon buttons, visible focus states, and readable contrast.
- **Easy to extend.** The language list, styling, and translation provider are all isolated in `src/App.jsx`, so it's simple to add languages, swap in a different translation API, or restyle it.

## Tech stack

| Layer | Choice |
|---|---|
| UI framework | React 18 |
| Build tool | Vite |
| Icons | lucide-react |
| Translation | MyMemory Translation API (free, no key) |
| Speech | Browser Web Speech API (`speechSynthesis`) |
| Hosting | GitHub Pages (via GitHub Actions) |

## Known limits

- The free MyMemory API caps anonymous requests at roughly 500 characters and a daily word quota per IP address — fine for a personal or demo project, not for heavy production traffic.
- Text-to-speech voice quality depends on the voices installed in the visitor's browser/OS; some languages will sound more natural than others.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This outputs a static site into the `dist` folder.

## Deploy to GitHub Pages

This repo already includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys automatically on every push to `main`. After pushing this project to GitHub:

1. Go to your repo → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push any commit to `main` (or re-run the workflow from the **Actions** tab).
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

---

Built as a learning project to practice UI design, calling a third-party API, and deploying a static site.
