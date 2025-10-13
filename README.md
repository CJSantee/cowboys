# 🤠 Cowboy Counter

A competitive photo-sharing web application where five cowboys compete in a year-long hat-wearing challenge. Built with React, TypeScript, and modern web technologies.

## 📖 About The Competition

The Cowboy Competition is a year-long friendly rivalry (January 12, 2025 - January 12, 2026) where five cowboys earn points by taking photos of themselves wearing cowboy hats in public places. The cowboy with the fewest points at the end becomes "The Loser" and faces a humorous punishment chosen by the other four cowboys.

### 🏆 Rules Summary

- **Duration**: One full year (Jan 12, 2025 6:06 PM CT - Jan 12, 2026 6:06 PM CT)
- **Scoring**: 1 point per valid photo, 3 points if mounted on a horse
- **Submission Limit**: One photo per cowboy per calendar day
- **Location Requirement**: Photos must be taken in public places (workplace doesn't count)
- **Punishment**: Loser wears an outfit chosen by the other cowboys to a group outing
- **Integrity**: "Shame" clause allows 4 cowboys to deduct 3 points from the 5th for unsportsmanlike conduct

## ✨ Features

### 📸 Photo Management
- **Photo Gallery**: Swipeable photo viewer with touch/gesture support
- **Photo Submission**: Upload photos with date selection and cowboy tagging
- **Image Processing**: Automatic image optimization and storage

### 📊 Competition Tracking
- **Real-time Leaderboard**: Interactive bar chart showing current standings
- **Individual Profiles**: Public cowboy profiles with stats and photo galleries
- **Progress Tracking**: Visual progress indicators and submission history

### 🔐 Authentication & Security
- **User Authentication**: Secure login system with session management
- **Protected Routes**: Authenticated access for submission and account features
- **Role-based Access**: Different permissions for participants vs. viewers

### 📱 User Experience
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Dark Mode Support**: Automatic theme switching
- **Progressive Web App**: Installable on mobile devices
- **Touch Gestures**: Swipe navigation for photo galleries

### ⚖️ Charter System
- **Digital Charter**: Full competition rules and regulations
- **Cowboy Assent**: Digital signature system for rule acknowledgment
- **Rule Enforcement**: Built-in systems for managing competition integrity

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite React** - React components built on Tailwind

### State Management & Data
- **TanStack Query** - Server state management and caching
- **React Router** - Client-side routing
- **Pondero Client** - Custom authentication and API client

### UI/UX Libraries
- **React Swipeable** - Touch gesture support
- **ApexCharts** - Interactive charts and data visualization
- **Date-fns** - Modern date utility library
- **Sonner** - Toast notifications
- **Headless UI** - Accessible UI primitives

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CJSantee/cowboys.git
cd cowboys
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Charts/         # Chart components (BarChart, etc.)
│   ├── AuthComponent.tsx
│   ├── Header.tsx
│   ├── Leaderboard.tsx
│   └── ...
├── pages/              # Route components
│   ├── home/          # Home page sections
│   │   ├── Photos.tsx
│   │   ├── Rules.tsx
│   │   └── Leaderboard.tsx
│   ├── cowboys/       # Cowboy profile pages
│   ├── Home.tsx
│   ├── Login.tsx
│   └── Submit.tsx
├── hooks/             # Custom React hooks
│   ├── queries/       # Data fetching hooks
│   └── mutations/     # Data mutation hooks
├── assets/           # Static assets
└── types/            # TypeScript type definitions
```

## 🌐 Deployment

The application is configured for deployment on Vercel with the included `vercel.json` configuration. The build process uses Vite for optimized production bundles.

## 🤝 Contributing

This is a private competition app for five specific cowboys, but the codebase demonstrates modern React development patterns and could serve as a reference for similar competitive applications.

## 📄 License

Private repository - All rights reserved.

## 🎯 Competition Status

**Current Phase**: Active Competition  
**End Date**: January 12, 2026 at 6:06 PM CT  
**Participants**: 5 Cowboys  
**Current Leader**: Check the leaderboard at [cowboycounter.com](https://cowboycounter.com)

---

*May the best cowboy win! 🤠*
