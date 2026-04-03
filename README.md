This is a [Next.js](https://nextjs.org) project with a simple frontend, backend API routes, and SQLite database.

## Features

- Frontend: Next.js with React and Tailwind CSS
- Backend: API routes in Next.js (serverless on Netlify)
- Database: SQLite for local development

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the users list.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## API Routes

- `GET /api/users`: Returns a list of users from the SQLite database.

## Deploy to Netlify

1. Push your code to a Git repository (e.g., GitHub).
2. Connect your repository to Netlify.
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: (leave default, Netlify will handle)
4. Deploy.

Note: Since SQLite is file-based, the database will not persist data across serverless function calls on Netlify. For production, consider using a cloud database like Supabase or PlanetScale.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
