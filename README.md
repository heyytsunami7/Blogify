<p align="center">
  <img src="public/favicon.svg" alt="Blogify logo" width="96" />
</p>

<h1 align="center">Blogify</h1>

<p align="center">
  A blogging platform where developers write, publish and share posts.<br />
  Built with React and Appwrite, with light and dark themes.
</p>

<p align="center">
  <a href="https://blogify-nine-swart.vercel.app/">Live demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&labelColor=20232a" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Appwrite-F02E65?logo=appwrite&logoColor=white" alt="Appwrite" />
</p>

## Features

- Sign up, log in and log out (Appwrite Auth), with an account menu
- Write posts in a rich text editor with a cover image, tags and an optional summary
- Draft or published: drafts are visible only to their author
- Edit and delete your own posts only, enforced by Appwrite row permissions
- Public Stories page with search and a tag filter
- Upvotes and flat comments on every post
- My posts dashboard with a Draft / Published filter, and public author profiles
- Home page with live stats, a stories-per-month chart and a featured post
- Light and dark theme that remembers your choice
- Posts are sanitised with DOMPurify before rendering
- Responsive from phone to desktop, with a skip link and reduced-motion support

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Redux Toolkit, React Router, React Hook Form
- **Backend:** Appwrite (auth, database, storage)
- **Editor and safety:** react-quill-new, DOMPurify

## Run it locally

```bash
git clone https://github.com/heyytsunami7/Blogify.git
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
| `BLOGIFY_APPWRITE_UPVOTES_COLLECTION_ID` | Upvotes collection ID |
| `BLOGIFY_APPWRITE_COMMENTS_COLLECTION_ID` | Comments collection ID |

## Appwrite setup

1. Create a project and add a **Web** platform for `localhost` and your deployed domain.
2. Create a database and a **posts** collection with **Row security on** and the permission **Users: Create**. Columns:

   | Column | Type | Required |
   |---|---|---|
   | `title` | string, 255 | yes |
   | `content` | string, 1000000 | yes |
   | `featuredImage` | string, 255 | yes |
   | `status` | string, 255 (`published` or `draft`) | no |
   | `tags` | string array, size 30 | no |
   | `userId` | string, 255 | yes |
   | `authorName` | string, 100 | no |
   | `summary` | string, 200 | no |

   Indexes (type Key): `status` and `userId`.
3. Create an **upvotes** collection (Row security on, **Users: Create**) with required string columns `postId` and `userId` (36 each). Indexes: a **unique** index on `postId` + `userId`, and a key index on `postId`.
4. Create a **comments** collection (Row security on, **Users: Create**) with required string columns `postId` (36), `userId` (36), `authorName` (100) and `body` (500). Index: key on `postId`.
5. Create a storage bucket with **File security on** and **Users: Create**.
6. Copy the IDs into `.env`.

## Deploy

The app is a static single-page build, so it runs on Vercel as is:

1. Import the repo into Vercel.
2. Add the 7 `BLOGIFY_*` variables above.
3. Deploy. `vercel.json` already rewrites every path to `index.html`, so refreshing on `/post/some-slug` works.
4. Add your Vercel domain as a **Web** platform in Appwrite, or logins will fail with a CORS error.

Vite bakes the variables in at build time, so redeploy after changing them.

## Project structure

```
src/
  appwrite/     auth and database/storage service classes
  components/   shared UI: header, footer, post card, editor, comments, upvotes
  pages/        Home, Stories, Post, My posts, Profile, Add/Edit post, 404
  store/        Redux auth slice
  utils/        excerpt, read time, slug and tag helpers, page title hook
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the unit tests |

## License
