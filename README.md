# Voyagr — Smart Travel Planner

A full-stack travel planning app built with **Next.js**, **Tailwind CSS**, **Framer Motion**, **Express.js**, and **MongoDB**.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router)           |
| Styling    | Tailwind CSS                      |
| Animations | Framer Motion                     |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Fonts      | Google Fonts (Plus Jakarta Sans, JetBrains Mono)|

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas URI

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/voyagr
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

To use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Run in development (both servers)
```bash
npm run dev
```

This starts:
- **Next.js** on `http://localhost:3000`
- **Express** on `http://localhost:5000`

### 4. Build for production
```bash
npm run next:build
npm run next:start    # Next.js
npm run server:start  # Express
```

---

## API Endpoints

### Trips
| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/trips        | Get all trips      |
| GET    | /api/trips/:id    | Get single trip    |
| POST   | /api/trips        | Create trip        |
| PUT    | /api/trips/:id    | Update trip        |
| DELETE | /api/trips/:id    | Delete trip        |

### Expenses
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | /api/expenses/trip/:tripId      | Get expenses for trip   |
| GET    | /api/expenses/trip/:tripId/summary | Budget summary       |
| POST   | /api/expenses                   | Add expense             |
| PUT    | /api/expenses/trip/:tripId/budget | Update budget         |
| DELETE | /api/expenses/:id               | Delete expense          |

### Weather
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/weather?city=Tokyo | Get weather + forecast  |

---

## Features

- **Discover** — Search 8 curated destinations with animated cards
- **Itinerary** — Day-by-day builder with Framer Motion drag-and-drop reordering, auto-saved to MongoDB
- **Map** — HTML5 Canvas world map that auto-plots itinerary destinations with route lines
- **Budget** — Per-trip expense tracker with animated progress bar, category breakdown, stored in MongoDB
- **Weather** — 7-day forecast for any destination with quick-pick shortcuts
