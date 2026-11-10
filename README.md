<p align="center">
  <img src="public/favicon.svg" alt="Blogify logo" width="96" />
</p>

<h1 align="center">Blogify</h1>

<p align="center">
  A blogging platform where developers write, publish and share posts.<br />
  Built with React and Appwrite, with light and dark themes.
</p>

<p align="center">
  <a href="<your-vercel-url>">Live demo</a>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit 2" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/React_Hook_Form-7-EC5990?logo=reacthookform&logoColor=white" alt="React Hook Form 7" />
  <img src="https://img.shields.io/badge/Appwrite-28-F02E65?logo=appwrite&logoColor=white" alt="Appwrite 28" />
  <img src="https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white" alt="ESLint 10" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white" alt="Deployed on Vercel" />
</p>

# Blogify

A blogging platform where developers write, publish and share posts. Built with React and Appwrite, with light and dark themes and a design system made from scratch.

## Features

- Sign up, log in and log out (Appwrite Auth)
- Write posts in a rich text editor, add a cover image and up to 5 tags
- Draft or published: drafts are visible only to their author
- Edit and delete your own posts only, enforced by Appwrite row permissions
- Home page with live stats, a stories-per-month chart and a featured post
- Light and dark theme that remembers your choice
- Posts are sanitised with DOMPurify before rendering
- Responsive from phone to desktop

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, React Hook Form
- **Backend:** Appwrite (auth, database, storage)
- **Editor and safety:** react-quill-new, DOMPurify

## Run it locally

```bash
git clone <repo-url>
cd Blogify
npm install
cp .env.sample .env   # then fill in your Appwrite IDs
npm run dev
```

### Environment variables

Only variables starting with `BLOGIFY_` reach the browser (see `envPrefix` in `vite.config.js`), so never put secrets in them.

| Variable | What it is |
|---|---|
| `BLOGIFY_APPWRITE_URL` | Appwrite endpoint, e.g. `https://fra.cloud.appwrite.io/v1` |
| `BLOGIFY_APPWRITE_PROJECT_ID` | Project ID |
| `BLOGIFY_APPWRITE_DATABASE_ID` | Database ID |
| `BLOGIFY_APPWRITE_COLLECTION_ID` | Posts collection ID |
| `BLOGIFY_APPWRITE_BUCKET_ID` | Storage bucket ID for cover images |

### Appwrite setup

1. Create a project and add a **Web** platform for `localhost` and your deployed domain.
2. Create a database and a collection with **Row security on**. Columns: `title` (string 255), `content` (string, large), `featuredImage` (string 255), `status` (string 255), `tags` (string array, size 30), `userId` (string 255). Add an index on `status`.
3. Create a storage bucket with **File security on**.
4. Copy the IDs into `.env`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## License

MIT
