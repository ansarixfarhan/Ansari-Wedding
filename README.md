# 💍 Ansari Wedding Invitation

A personalised digital wedding invitation web app for the **Ansari Wedding**. Enter a guest's name, preview the invitation with their name overlaid, and share it directly on WhatsApp or download it as a PDF — all from the browser.

## ✨ Features

- **Personalised Invitations** — Type the guest's name and it appears on the invitation card in real-time.
- **Multiple Modes** — Choose "Guest only", "With Family", or add a custom line.
- **PDF Generation** — Builds a multi-page PDF with the guest's name embedded using [pdf-lib](https://pdf-lib.js.org/).
- **WhatsApp Sharing** — One-tap share via the Web Share API (with WhatsApp fallback).
- **Server-Side Rendered** — Built on TanStack Start with Nitro for fast initial loads and SEO.
- **Deployed on Cloudflare** — Runs on Cloudflare Workers with automatic deploys from GitHub.

## 🛠️ Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| Framework    | [TanStack Start](https://tanstack.com/start) (React 19) |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI           | [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| PDF          | [pdf-lib](https://pdf-lib.js.org/) + fontkit |
| Server       | [Nitro](https://nitro.build/) (Cloudflare Workers preset) |
| Hosting      | [Cloudflare Workers](https://workers.cloudflare.com/) |
| CI/CD        | GitHub Actions → Cloudflare auto-deploy     |

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:8080**.

### Build & Preview

```bash
npm run build
npm run preview
```

### Deploy

Deployment happens automatically on every push to `main` via GitHub Actions. You can also deploy manually:

```bash
npm run build
npm run deploy
```

## 🌐 Live

**[https://invitation.ansarixfarhan.cloud](https://invitation.ansarixfarhan.cloud)**

## 📁 Project Structure

```
├── public/
│   └── invite/          # Invitation page images & base PDF
├── src/
│   ├── components/ui/   # shadcn/ui components
│   ├── lib/             # PDF builder, utilities
│   ├── routes/          # TanStack Router pages
│   └── styles.css       # Tailwind + custom styles
├── .github/workflows/   # CI/CD pipeline
└── vite.config.ts       # Vite + TanStack Start config
```

## 📄 License

This project is private and not licensed for redistribution.

---

**Made with ❤️ by [Farhan Ansari](https://ansarixfarhan.cloud)**

