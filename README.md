# Skillpath

Skillpath is a responsive course-discovery experience with a live catalogue, regional pricing, routed course-detail pages, and a contextual AI assistant.

The assistant receives the selected course’s verified metadata and recent conversation history on the server. It is instructed to answer only from that context and to state when the available course information is insufficient. API credentials never enter the browser bundle.

## Run locally

```bash
pnpm install
pnpm dev
```

## Validate

```bash
pnpm test
pnpm build
```

## Provider configuration

Configure one or more server-only environment variables through the project’s secure Secrets settings: `OPENROUTER_API`, `GROQ_API`, `MISTRAL_API`, `GEMINI_API`, and `COHERE_API`. The server attempts configured providers in that order and returns a user-safe error if none are available. `SCALEDOWN_API` is reserved for future context compression of longer course material.

## Deploy to Vercel

The repository includes `vercel.json` and `api/[...path].ts`. Vercel serves the built frontend from `dist/public` and invokes the catch-all function for server-side API routes, including the assistant and OAuth callback.

In Vercel **Project Settings → Environment Variables**, add the provider variables above for the required environments. They must remain server-only: do **not** use a `VITE_` prefix. The first deployment can build without provider keys, but the course assistant requires at least one configured provider at runtime.

## Structure

The catalogue component is in `client/src/components/SkillpathCourses.jsx`, course details are in `client/src/pages/CourseDetail.jsx`, and the grounded assistant fallback chain is in `server/courseAssistant.ts`.
