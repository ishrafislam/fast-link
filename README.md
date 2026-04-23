# Fast Link

Fast Link is a Vite + Vue 3 dashboard that signs in with GitHub and shows every repository you can access across your personal account and organizations.

## Stack

- Vite + Vue 3 + TypeScript
- Pinia for client state
- Vue Router for navigation
- Vercel serverless functions for GitHub OAuth and API proxying

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `APP_BASE_URL`
- `SESSION_SECRET`

## GitHub OAuth setup

Create a GitHub OAuth App and set:

- Homepage URL: your app base URL
- Authorization callback URL: `APP_BASE_URL/api/auth/github/callback`

## Scripts

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`
