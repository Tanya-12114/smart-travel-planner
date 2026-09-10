# Voyagr — Smart Travel Planner

A full-stack travel planning app built with **Next.js**, **Tailwind CSS**, **Framer Motion**, **Express.js**, and **MongoDB** with **JWT authentication**, allowing users to register, plan trips, manage itineraries, track travel expenses, visualize destinations on maps, and access weather data.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router)           |
| Styling    | Tailwind CSS                      |
| Animations | Framer Motion                     |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB + Mongoose                |
| Testing (backend)  | Jest + Supertest          |
| Testing (frontend) | Vitest + React Testing Library |
| Fonts      | Google Fonts (Plus Jakarta Sans, JetBrains Mono) |

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

## Testing

The project has two separate test suites — one for the Express backend, one for the React frontend.

### Run backend tests (Jest + Supertest)
```bash
npm test
```
Covers the `/api/auth` and `/api/trips` routes: request validation, authentication/authorization checks, and CRUD logic. Mongoose models are mocked, so no real database connection is needed to run these.

### Run frontend tests (Vitest + React Testing Library)
```bash
npm run test:frontend
```
Covers the `LoginPage` and `RegisterPage` components: form rendering, input handling, submit behavior, client-side validation (e.g. blocking submission on mismatched passwords), and loading/error states. `useAuth()` is mocked so tests run against component logic only, not the live API.

### Run everything
```bash
npm run test:all
```

**Current coverage:** 24 tests total — 16 backend, 8 frontend, all passing.

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
 
- **Authentication** — Secure login and registration with JWT + cookies. Each user's data is fully private, session lasts 7 days.
 
- **Discover** — Search any city or country worldwide. Live results include best travel time, avg daily cost in rupees, and a Wikipedia description.
 
- **Itinerary** — Day-by-day trip builder with event add/reorder. Auto-assigns SVG icons by event type and saves to MongoDB in real time.
 
- **Map** — Interactive world map with great-circle flight routes from your location to each trip destination. Select one destination at a time.
 
- **Budget** — Track trip expenses in rupees by category (flights, hotels, food, etc.) with an animated progress bar and per-trip budget limit.
 
- **Weather** — Live 7-day forecast for any city via Open-Meteo (no API key needed). Auto-shows weather for all your itinerary destinations.