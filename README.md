# EazyAssign — Student Assignment Management Dashboard

A modern, responsive dashboard for managing student assignments with role-based functionality. Built with React, Vite, and Tailwind CSS v4.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)

## Features

### Student Portal
- View all assigned assignments with due dates and status
- **Double-verification submission flow** — two-step confirmation before marking an assignment as submitted
- Progress tracking with visual indicators
- Direct links to Google Drive for external submission
- Overdue/deadline warnings

### Professor Dashboard
- Create and manage assignments with full details
- Attach Google Drive links for external submission
- Assign specific students per assignment
- **Individual progress bars** per assignment showing submission rates
- Expandable student-level submission status (submitted / pending)
- Delete assignments with confirmation

### General
- Role-based access — each user sees only their own data
- Responsive design (mobile, tablet, desktop)
- Modern glassmorphism UI with animated gradients
- Data persisted to `localStorage` (no backend required)
- Reset to demo data at any time

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component framework (hooks, Context API) |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first CSS styling |
| React Router DOM 7 | Client-side routing |
| Lucide React | Icon library |
| localStorage | Data persistence (mock backend) |

## Project Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd eazy-ass

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

### Deploy

The `dist/` folder after `npm run build` can be deployed to any static hosting:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag & drop `dist/` or connect the repo
- **Docker**: See Dockerfile section below

## Folder Structure

```
eazy-ass/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx    # Professor view with assignment management
│   │   │   └── CreateAssignmentModal.jsx  # Form to create new assignments
│   │   ├── auth/
│   │   │   └── LoginPage.jsx         # Role selection & user picker
│   │   ├── shared/
│   │   │   ├── ConfirmModal.jsx      # Reusable confirmation dialog
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   ├── ProgressBar.jsx       # Configurable progress bar
│   │   │   └── StatCard.jsx          # Dashboard stat card
│   │   └── student/
│   │       └── StudentDashboard.jsx  # Student view with assignment list
│   ├── context/
│   │   ├── AuthContext.jsx           # Authentication state (login/logout)
│   │   └── DataContext.jsx           # Assignment & submission data layer
│   ├── data/
│   │   └── mockData.js              # Demo users, assignments, submissions
│   ├── App.jsx                       # Root component with role routing
│   ├── index.css                     # Tailwind imports & custom styles
│   └── main.jsx                      # Entry point with providers
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Component Architecture

### Data Flow

```
AuthContext (user session)
    │
    ├── LoginPage ← role selection → user picker
    │
    └── App (routes by role)
         ├── Navbar (shared)
         ├── StudentDashboard
         │    ├── StatCards
         │    ├── ProgressBar (overall)
         │    ├── Assignment cards
         │    └── ConfirmModal (double-verify)
         └── AdminDashboard
              ├── StatCards
              ├── ProgressBar (overall)
              ├── Assignment cards (expandable)
              │    └── Per-student submission status
              ├── CreateAssignmentModal
              └── ConfirmModal (delete)
```

### Design Decisions

1. **Context API over Redux** — The app's state is simple enough that React Context + `useState` provides clean state management without extra dependencies.

2. **localStorage persistence** — All data is stored in the browser's `localStorage`, simulating a backend. A "Reset Demo" button restores the original mock data.

3. **Double-verification flow** — Students must confirm twice before marking an assignment as submitted, preventing accidental submissions. Step 1 asks "Have you submitted?", Step 2 requires final confirmation.

4. **Glassmorphism UI** — The dark theme with frosted glass effects, gradient backgrounds, and subtle glow creates a modern, polished look while maintaining readability.

5. **Role-based isolation** — Students only see assignments assigned to them. Professors only see assignments they created. No cross-role data leakage.

6. **Component-based architecture** — Shared components (`ProgressBar`, `StatCard`, `ConfirmModal`) are reused across both dashboards, keeping the codebase DRY.

## Demo Accounts

### Professors
| Name | Email |
|---|---|
| Prof. Sarah Chen | sarah.chen@university.edu |
| Prof. James Miller | james.miller@university.edu |

### Students
| Name | Email |
|---|---|
| Alex Thompson | alex.t@student.edu |
| Maria Garcia | maria.g@student.edu |
| David Kim | david.k@student.edu |
| Emily Brown | emily.b@student.edu |
| Ryan Patel | ryan.p@student.edu |
| Sophie Wilson | sophie.w@student.edu |

## License

MIT
