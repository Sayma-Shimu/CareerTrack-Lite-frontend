# CareerTrack Lite — Frontend

A responsive React + TypeScript frontend for CareerTrack Lite, a full-stack job application tracking system.

---

## Live Links

- **Frontend:** _(add Vercel link after deployment)_
- **Backend API:** _(add Render link after deployment)_

---

## Features

- Register and log in securely with JWT authentication
- Protected dashboard showing application statistics
- Add, view, edit and delete job applications
- Search by company or job title
- Filter by application status and source
- Sort by newest or oldest application date
- Responsive layout for desktop and mobile
- Loading, empty and error states throughout
- Delete confirmation modal
- Status badges with color coding

---

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v6
- Lucide React (icons)
- CSS custom properties (no CSS framework)

---

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Sayma-Shimu/CareerTrack-Lite-frontend.git
cd CareerTrack-Lite-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

In production, set `VITE_API_URL` to your deployed backend URL.

---

## Test Credentials

```
Email:    test@careertrack.com
Password: test1234
```

_(Create this account after deployment using the Register page)_

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing / home page |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | Stats and recent applications (protected) |
| `/applications` | Full CRUD list with search and filter (protected) |
| `*` | 404 Not Found |

---

## AI Tools Used

Kiro AI was used for code assistance, debugging and implementation guidance during development.

---

## Known Limitations & Future Improvements

- No pagination on the applications list (planned)
- No email verification on registration
- Charts/graphs for dashboard analytics (planned bonus)
- Dark/light theme toggle (planned)
