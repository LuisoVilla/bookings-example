# Booking CRUD

Single-page React app to create / read / update / delete bookings.

## Login

Use these default credentials:

- Username: `user`
- Password: `123456`

## UX notes

- Inline form validation (required dates, start <= end, and no-overlap) with keyboard submit (Enter).
- Light/Dark mode toggle (top-right), persisted in `localStorage`.

## Tech

- React + TypeScript (Vite)
- Material UI (components + responsive layout)
- Zustand (global state)
- React-Toastify (toast notifications)

## Requirements covered

- CRUD bookings (create, list/read, update, delete)
- Validation: start/end dates required + start <= end
- Prevent overlapping bookings (inclusive range check)
- Responsive UI for mobile and desktop

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
