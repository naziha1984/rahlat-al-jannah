# Copilot Instructions for رحلات الجنة (Voyages du Paradis)

## Architecture Overview
- **Monorepo**: `client/` (React + Vite) for frontend, `server/` (Node.js/Express) for backend, MongoDB Atlas for database.
- **Frontend**: Uses React, Tailwind CSS, React Router, i18next (multilingual), Axios (API calls). Pages and components are in `client/src/pages/` and `client/src/components/`.
- **Backend**: Express REST API, JWT authentication, Mongoose models in `server/models/`, controllers in `server/controllers/`, routes in `server/routes/`, and middleware in `server/middleware/`.
- **Data Flow**: Frontend communicates with backend via `/api` endpoints (proxied in dev by Vite). MongoDB stores users, offers, bookings.
- **Admin Panel**: Accessible at `/admin` route, protected by authentication and role-based access.

## Developer Workflows
- **Install all dependencies**: `npm run install-all` (runs install in both `client` and `server`)
- **Start development**: `npm run dev` (concurrently runs frontend and backend in dev mode)
- **Build frontend**: `cd client && npm run build`
- **Environment config**: Copy `server/.env.example` to `server/.env` and set MongoDB URI, JWT secret, etc.
- **API endpoints**: See README for main routes (destinations, reservations, admin CRUD)

## Project Conventions & Patterns
- **Multilingual**: All user-facing text uses i18next. Translations in `client/src/locales/` (`ar.json`, `fr.json`, `en.json`). Use `useTranslation()` in React components.
- **Styling**: Tailwind CSS utility classes. Custom styles/components in `client/src/index.css`.
- **Component Structure**: Pages in `client/src/pages/`, reusable UI in `client/src/components/` (e.g., `Layout`, `Auth`, `DestinationCard`).
- **API Services**: Centralized in `client/src/services/api.js`.
- **Authentication**: JWT-based, with protected routes and admin role checks in both frontend (React context) and backend (middleware).
- **Data Models**: Mongoose schemas for `User`, `Offer`, `Booking` in `server/models/`.
- **Error Handling**: API errors are returned as JSON with status codes; frontend displays user-friendly messages.

## Integration & External Dependencies
- **MongoDB Atlas**: Cloud database, URI in backend `.env`.
- **Vercel/Netlify**: For frontend deployment (`client/dist`)
- **Render/Railway**: For backend deployment
- **Social Media**: Facebook page link/icon in header/footer, can embed latest posts.

## Examples
- To add a new page: create a file in `client/src/pages/`, add route in main router, and translation keys in all `locales/*.json`.
- To add a new API endpoint: create controller in `server/controllers/`, add route in `server/routes/`, update model if needed.
- To add a new language: add a new JSON file in `client/src/locales/` and update i18next config.

## Key Files & Directories
- `client/src/pages/` – Main app pages
- `client/src/components/` – Reusable UI components
- `client/src/locales/` – Translation files
- `client/src/services/api.js` – API calls
- `server/models/` – Mongoose schemas
- `server/controllers/` – API logic
- `server/routes/` – Express routes
- `server/middleware/` – Auth, validation, etc.

---
For more, see the README.md or open an issue for project-specific questions.
