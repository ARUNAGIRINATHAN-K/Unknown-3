<div align="center">
  <img width="1200" height="475" alt="DigitScope Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  <h1>DigitScope</h1>
  <p>Interactive playground to draw digits, visualize a CNN’s activations, and see prediction confidence in real time.</p>

  <p>
    <!-- Stack Badges -->
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-CDN-06B6D4?logo=tailwindcss&logoColor=white" />
  </p>
  <p>
    <!-- Tools Badges -->
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=node.js&logoColor=white" />
    <img alt="npm" src="https://img.shields.io/badge/npm-9+-CB0000?logo=npm&logoColor=white" />
  </p>
</div>

---

## Overview

DigitScope is a lightweight, educational React + TypeScript app that simulates the inner workings of a convolutional neural network (CNN) on MNIST-like digits. Draw a digit, then explore how activations flow through layers and how dropout influences the model’s confidence.

This project runs fully offline by default using a mocked prediction service. It’s great for demos, teaching, and quick intuition building.

## Screenshot

![DigitScope UI](img/Screenshot%202025-11-17%20154332.png)

## Features

- Draw a digit on a responsive canvas and downscale to 28×28
- Visualize per-layer activations (Conv, MaxPool, Flatten, Dense)
- Adjustable dropout rate with live impact on predictions
- Clean UI using Tailwind (CDN) and React 19
- No API key required out of the box (mocked predictions)

## Tech Stack

- React 19 + React DOM 19
- TypeScript 5
- Vite 6 with `@vitejs/plugin-react`
- Tailwind CSS via CDN

## Project Structure

```
.
├─ App.tsx
├─ index.html
├─ src/
│  └─ index.tsx
├─ components/
│  ├─ ControlPanel.tsx
│  ├─ DrawingCanvas.tsx
│  ├─ NetworkVisualizer.tsx
│  ├─ PredictionBar.tsx
│  └─ shared/Card.tsx
├─ services/
│  ├─ geminiService.ts        # Mocked predictions (offline)
│  └─ simulationService.ts    # Activation simulation + dropout
├─ types.ts
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

Note: The app entry is `src/index.tsx` (recommended Vite convention).

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)

### Install

```powershell
npm install
```

### Run in Development

```powershell
npm run dev
```

Vite will print a local URL. Open it in your browser.

### Build for Production

```powershell
npm run build
npm run preview
```

`preview` serves the built assets locally to verify the production bundle.

## Configuration

- Predictions: `services/geminiService.ts` is mocked for offline use. If you later wire up a real model (e.g., Gemini) you can introduce an API client and optional `GEMINI_API_KEY` in `.env.local`. The current code does not require it.
- Styling: Tailwind is loaded via CDN in `index.html`. For larger projects, consider switching to a PostCSS build pipeline.

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview built output

## Accessibility & UX

- High-contrast colors and large controls
- Responsive canvas and layout
- Keyboard focus styles on interactive controls

## Deployment

The app builds to static assets and can be hosted on any static provider (GitHub Pages, Netlify, Vercel, Azure Static Web Apps, etc.).

1. `npm run build`
2. Upload `dist/` to your hosting provider

## Roadmap

- Optional real model integration (Gemini or ONNX runtime)
- Expand activation visualizations and layer controls
- Mobile drawing improvements and multi-input support

## Acknowledgements

- Inspired by educational CNN visualizations and playgrounds; see also Google’s Generative AI documentation for related concepts.

## License

ISC © Contributors
