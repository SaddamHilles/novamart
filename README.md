# NovaMart

A complete first MERN stack project: a curated e-commerce shop with accounts, a product catalog, reviews, a persistent cart, checkout, orders, and an admin inventory screen.

**Stack:** MongoDB · Express · React · Node.js · TypeScript

## What you can do

- Browse and search products
- Sign up / sign in with JWT, plus Google, Facebook, and GitHub OAuth
- Add items to a cart saved on your user document
- Place an order (card is simulated; cash on delivery is unpaid)
- Leave one review per product
- Admin users can add or delete products

## Run it

```bash
cd novamart
npm install
npm run install-all
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

The API first tries `mongodb://127.0.0.1:27017/novamart`. If that local server is not running, it starts an in-memory MongoDB and seeds the catalog automatically so you can still learn the full MERN flow. In-memory data resets when you stop the server.

On Windows you can also try `start-mongo.bat` if MongoDB Community is installed at `C:\Program Files\MongoDB\Server\8.3`. If `mongod` exits immediately, install the latest [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist) and start MongoDB again.

### Demo accounts

| Role  | Email                 | Password  |
| ----- | --------------------- | --------- |
| Shopper | `demo@novamart.dev` | `Demo123!` |
| Admin   | `admin@novamart.dev` | `Admin123!` |

## Project layout

```
novamart/
  backend/    Express + Mongoose API in TypeScript
  frontend/   Vite + React storefront in TypeScript
```

The API lives at `http://localhost:5000`. The Vite dev server proxies `/api` to it.

## Social sign-in

Add app credentials to `backend/.env` (never paste them into chat):

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Use these callback URLs in each developer console:

- Google: `http://localhost:5000/api/auth/google/callback`
- Facebook: `http://localhost:5000/api/auth/facebook/callback`
- GitHub: `http://localhost:5000/api/auth/github/callback`

Create apps at [Google Cloud](https://console.cloud.google.com/apis/credentials), [Facebook Login](https://developers.facebook.com/), and [GitHub Developer Settings](https://github.com/settings/developers). Restart the API after saving `.env`. Without those keys the buttons still show, but they return you to login with a configuration message.
