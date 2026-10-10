# FlexiGym

FlexiGym lets people book gym access for a few days at a time instead of signing up for a membership. Members find a gym, pick a date range and pay by card. Gym owners list their gyms, post promotions and track bookings and earnings. It was built by Group 09 for CSCI 5709 at Dalhousie University in summer 2024.

## Features

Accounts are either `user` (member) or `gym` (owner), chosen at sign-up.

Members can:

- search gyms by name and city, sorted by price or average rating
- read and write reviews; each review updates the gym's rating totals
- book a start and end date, priced at the gym's daily rate times the number of days, and pay through Stripe
- view, reschedule or delete their bookings
- browse promotions that gyms have posted
- reset a forgotten password with a token sent by email

Owners can:

- add and edit gyms (location, amenities, hours, daily price, images)
- see each gym's total bookings, total earnings and monthly charts
- create, edit and delete promotions for each gym
- see who booked and cancel a booking

## How it fits together

```
frontend/       Next.js 14 (App Router), Tailwind, shadcn/ui, Stripe Elements, Chart.js
backend/        Express + TypeScript + MongoDB driver: gyms, reviews, bookings,
                promotions, payments, owner stats
backend/auth/   Express (JavaScript) + Mongoose: register, login, password reset, profiles
```

The auth service signs an 8-hour JWT holding the user's id, email, name and account type. The frontend keeps it in `localStorage` and decodes it to decide which pages and links to show.

Both services must use the same MongoDB database. The main API connects to the `FlexiGym` database and reads the `userprofiles` collection that the auth service writes. Its other collections are `gyms`, `bookings`, `feedback` and `advertisements`.

Checkout calls `POST /api/create-payment-intent` to create a Stripe PaymentIntent in USD, confirms the card in the browser, then calls `POST /api/create-booking`. That saves the booking with status `succeeded` and emails a confirmation through Mailtrap.

## Running locally

You need Node, pnpm, MongoDB and Stripe test keys. Mailtrap credentials only matter for email.

Main API, on port 8080:

```
cd backend
cp .env.example .env    # MONGODB_URI, STRIPE_SECRET_KEY, EMAIL_USER, EMAIL_PASS
pnpm install
pnpm dev
```

Auth service:

```
cd backend/auth
cp .env.example .env    # PORT=4000, MONGODB_URI, JWT_SECRET
pnpm install
pnpm start
```

Use `start`, which runs `src/index.js`. The `dev` script runs `src/app.ts`, which imports a `routes/gyms` file that is not in this folder. Password reset emails also read `NODEMAIL_SERVICE`, `NODEMAIL_USERNAME`, `NODEMAIL_PASSWORD`, `FROM_USERNAME` and `FROM_EMAILADDRESS`, which `.env.example` does not list.

Frontend, on port 3000:

```
cd frontend
cp .env.local.example .env.local
pnpm install
pnpm dev
```

In `.env.local`, set `NEXT_PUBLIC_API_URL=http://localhost:8080` and `NEXT_PUBLIC_AUTH_URL=http://localhost:4000`. The example file points the auth URL at a hosted Render instance.

## Known gaps

- The main API does not check the JWT. Only the auth service's `/profile` routes require a token.
- The owner dashboard passes the owner's user id to stats endpoints that match bookings by `gymId`, so its totals show zero. Per-gym analytics pages work.
- `checkout-form.tsx` shows a success toast and creates the booking even when Stripe returns a payment error.
- `POST /api/create-booking` sends no response when it succeeds.
- The `Best reviewed` sort does nothing because the API expects `Best reviewed and lowest price`.
- `EmailService.startReminderJob()` (hourly emails for bookings starting within 24 hours) is never called.
- `next.config.mjs` sets `ignoreBuildErrors: true`, so TypeScript errors do not fail the build.

## Team

Alishan Ali, Harsh Mehta, Jeet Jani, Kenee Patel, Mohd Faizan, Raj Chauhan.
