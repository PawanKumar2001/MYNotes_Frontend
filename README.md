# MYNotes — Frontend

A clean, minimal notes-taking web application built with the MERN stack. This repository contains the **React frontend** for MYNotes.

---

## 🖥️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | API requests |
| jwt-decode | Decoding JWT tokens |
| react-hot-toast | Toast notifications |
| Lucide React | Icons |

**Fonts:** Lobster Two (logo/title) · Inter (body)

---

## ✨ Features

- **Authentication** — Login and Register on a single page with animated tab toggle
- **Protected Routes** — JWT-based route protection; unauthenticated users are redirected
- **Add Notes** — Create notes with a title, description, and body
- **All Notes** — View all your notes in a responsive grid
- **Search** — Frontend search across title, description, and body in real time
- **Inline Editing** — Edit a note directly within its card without navigating away
- **Delete Notes** — Remove notes with a single click
- **Skeleton Loaders** — Shimmer placeholders while notes are loading
- **Toast Notifications** — Feedback for every action (success & error)
- **Responsive UI** — Works across mobile, tablet, and desktop
- **Time-based Greeting** — Navbar greets the user based on time of day

---

## 📁 Project Structure

```
src/
├── components/
│   └── home/
│       ├── Navbar.jsx
│       ├── Notebar.jsx
│       ├── AddNote.jsx
│       ├── AllNotes.jsx
│       ├── NoteCard.jsx
│       ├── NoteCardSkeleton.jsx
│       └── Footer.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── AuthPage.jsx
│   └── HomePage.jsx
├── utils/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/PawanKumar2001/MYNotes_Frontend.git
cd MYNotes_Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## 🔗 Backend

This frontend connects to the MYNotes REST API. The backend handles authentication and notes storage. You will need a running instance of the backend for the app to function.

Set the backend base URL in `src/utils/api.js` if you are running it locally:

```js
const BASE_URL = 'http://localhost:5000/api'
```

---

## 📄 Available Routes

| Route | Access | Description |
|---|---|---|
| `/auth` | Public | Login & Register page |
| `/allnotes` | Protected | View all notes |
| `/addnote` | Protected | Add a new note |

---

## 🎨 Theme

Minimal white and purple theme with subtle animations. Primary color — `#7c3aed`.

---

## 📌 Notes

- JWT tokens are stored in `localStorage` under the key `authorization-token`
- Empty note fields are automatically saved as `"Untitled"`
- Search is handled entirely on the frontend with no additional API calls

---

## 📃 License

This project is for personal and educational use.
