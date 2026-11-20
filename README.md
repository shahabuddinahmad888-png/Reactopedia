# Reactopedia

React + Vite application for learning React concepts, articles, tutorials, and quizzes.

## Requirements
- Node.js 20.19+ (or a compatible newer LTS release)
- npm 10+

## Setup (Windows PowerShell / Command Prompt)
1. Extract this ZIP and open a terminal in the `Reactopedia` folder (the folder containing `package.json`).
2. Install dependencies: `npm install`
3. Create your local environment file:
   - PowerShell: `Copy-Item .env.example .env`
   - Command Prompt: `copy .env.example .env`
4. Add your own Firebase project values to `.env` to enable registration, login, and protected pages. Enable Email/Password sign-in in Firebase Authentication.
5. Optionally add a Google Gemini API key as `VITE_GEMINI_API_KEY` to enable both AI chat widgets. Without it, the app still starts and the widgets explain that setup is missing.
6. Run `npm run dev` and open the local URL printed by Vite (normally `http://localhost:5173`).

## Other commands
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Configuration notes
- `.env` is intentionally not included. Never commit API keys or credentials.
- Firebase settings are required for authentication. The login screen displays a setup message when they are missing.
- `VITE_API_BASE_URL` is only needed if you connect a separate backend for article API calls. The original project contained a placeholder URL, not a working backend.
- Vite variables prefixed with `VITE_` are included in browser code and visible to users. For production, move Gemini requests to a secured server-side endpoint and restrict/rotate the exposed key.
- Firebase web API keys are identifiers, not server secrets; secure the project with authorized domains and Firestore Security Rules.
