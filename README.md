# Fast Link

Fast Link is a Vite + Vue 3 dashboard that accepts a GitHub personal access token and shows every repository you can access across your personal account and organizations.

## Stack

- Vite + Vue 3 + TypeScript
- Pinia for client state
- Vue Router for navigation
- Vercel serverless functions for token-backed GitHub API proxying

## Environment variables

Copy `.env.example` to `.env` and fill in:

- `APP_BASE_URL`
- `SESSION_SECRET`

## GitHub token setup

Create a fine-grained personal access token with:

- access to your user profile
- access to the repositories you want listed, including private repos if needed
- access to organization repositories you want surfaced in the dashboard

## Scripts

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`
