# Reactopedia

Reactopedia is a web app for learning React. It brings together topic articles, tutorials, search, an AI chat assistant, and a React quiz assistant.

## Features

- Browse React topics and filter featured articles by category.
- Search for learning content.
- Read articles, tutorials, and category pages.
- Sign in or register with Firebase Authentication.
- Use an AI chat assistant and a React quiz assistant powered by Google Gemini.
- Switch between light and dark themes.
- Edit article content with Firestore integration.
- Use the responsive navigation and footer links to move around the app.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, JavaScript, JSX, CSS |
| Development and build | Vite 6, Node.js, npm |
| Routing | React Router |
| Authentication and data | Firebase Authentication, Cloud Firestore |
| AI | Google Gemini API, `@google/genai` |
| API function hosting | Vercel serverless function |
| UI and utilities | Bootstrap, React Bootstrap, React Icons, Lucide, Axios, Fuse.js, Monaco Editor, React Live |

## Application routes

| Route | Page |
| --- | --- |
| `/login` | Sign in or register |
| `/` | Home and featured topics |
| `/article/:slug` | Article by slug |
| `/articles/:id` | Article by ID |
| `/articles/:id/edit` | Article editing page |
| `/category/hooks` | React Hooks category |
| `/category/:category` | Category page |
| `/tutorials` | Tutorials |
| `/about` | About Reactopedia |

Most learning pages require a signed-in user.

## Project structure

```text
api/
  chat.js                 Vercel function that sends prompts to Gemini
src/
  components/             Shared UI components, including auth and navigation
  context/                 User and theme contexts
  data/sampleData.js       Sample article content
  pages/                   Home, article, category, tutorial, and About pages
  Services/api.js          Optional external articles API client
  App.jsx                  App layout and routes
  chatbot.jsx              AI chat widget
  quizbot.jsx              React quiz widget
  firebase.js              Firebase initialization
```

## Requirements

- Node.js 20.19 or newer
- npm
- A Firebase project for authentication and Firestore features
- A Google Gemini API key for the AI widgets

## Run locally

Open a terminal in the folder containing `package.json`, then install dependencies:

```powershell
npm install
```

If you do not already have a `.env` file, create one from the example:

```powershell
Copy-Item .env.example .env
```

Add your Firebase project values to `.env`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Enable the Email/Password and Google sign-in providers in Firebase Authentication. Configure Firestore rules for your Firebase project before using Firestore-backed editing.

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The regular Vite server serves the frontend; it does not run `api/chat.js`. To test the Vercel API function locally, use the Vercel CLI after linking the project and configuring its environment variables:

```powershell
npx vercel dev
```

## Environment variables

| Variable | Where to configure | Purpose |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_AUTH_DOMAIN` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_PROJECT_ID` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_STORAGE_BUCKET` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_APP_ID` | Local `.env` and Vercel | Firebase client configuration |
| `VITE_FIREBASE_MEASUREMENT_ID` | Local `.env` and Vercel | Optional Firebase measurement configuration |
| `GEMINI_API_KEY` | Vercel server environment | Gemini key used by `api/chat.js` |
| `VITE_API_BASE_URL` | Local `.env` and Vercel, if needed | Base URL for the optional external articles API |

The current chatbot and quiz widgets send POST requests to `/api/chat`. That endpoint is a Vercel serverless function and uses `GEMINI_API_KEY`; the key should not be exposed in browser code. A GET request to `/api/chat` returns `405 Method Not Allowed` by design.

Article examples are loaded from `src/data/sampleData.js`. The separate Axios client in `src/Services/api.js` requires `VITE_API_BASE_URL` if you connect an external articles backend.

## Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Use the Vite framework preset. The build command is `npm run build`, and the output directory is `dist`.
3. Add the Firebase `VITE_FIREBASE_*` variables and the server-side `GEMINI_API_KEY` in **Project Settings → Environment Variables**.
4. Deploy the project. Later pushes to the connected production branch trigger a new deployment.

The `api/chat.js` function is configured in `vercel.json`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run start` | Start Vite |

## Security notes

- Do not commit `.env` files, API keys, or credentials.
- Variables prefixed with `VITE_` are included in browser code and are visible to users. Only use them for public client configuration.
- Keep `GEMINI_API_KEY` server-side in Vercel environment variables.
- Configure Firebase authorized domains and Firestore Security Rules for your deployment.
