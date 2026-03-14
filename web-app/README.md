# Euki Web - Period Tracker

A privacy-first, web-based period tracking application with educational content. This is a web version of the iOS Euki app, built with React, TypeScript, and Vite.

## Features

- 📅 **Period Tracking**: Log periods, symptoms, emotions, and health data
- 🔄 **Cycle Predictions**: Automatic cycle calculations and period forecasting
- 📚 **Educational Content**: Comprehensive sexual & reproductive health information
- 🔒 **Privacy First**: All data encrypted and stored locally - no cloud sync
- 🔐 **PIN Protection**: Optional security code for sensitive data
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop

## Quick Start

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Deployment to Vercel

```bash
npm install -g vercel
cd web-app
vercel --prod
```

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Zustand (state management)
- CryptoJS (encryption)
- date-fns (date utilities)
- Lucide React (icons)

## Privacy

- ✅ All data stored locally in encrypted browser storage
- ✅ No cloud synchronization
- ✅ No user accounts required
- ✅ No analytics or tracking
- ✅ Works offline

## Project Structure

```
src/
├── components/     # React components
├── lib/           # Business logic & utilities
├── store/         # Zustand state management
├── styles/        # Component styles
├── types/         # TypeScript types
└── App.tsx        # Main component
```

## License

GNU GPL v3.0
