# CVertex

CVertex is an AI-powered resume analysis platform designed to help users improve their resumes, optimize ATS compatibility, and track application progress through a modern and intelligent dashboard experience.

## Features

- AI-powered resume analysis
- ATS compatibility scoring
- Detailed resume feedback
- Resume upload and preview
- Application tracking dashboard
- PDF to image conversion
- Structured resume insights
- Persistent cloud storage using Puter
- Modern responsive UI
- Dark futuristic design system

---

## Tech Stack

### Frontend

- React
- React Router
- TypeScript
- TailwindCSS
- Zustand

### AI & Storage

- Puter.js
- Claude Sonnet 4

### Utilities

- PDF.js
- React Dropzone
- clsx
- tailwind-merge

---

## Screenshots

> Add screenshots here

```md
![Home](./screenshots/home.png)
![Upload](./screenshots/upload.png)
![Review](./screenshots/review.png)
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/cvertex.git
```

Move into the project directory:

```bash
cd cvertex
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Environment

CVertex uses Puter.js for authentication, storage, and AI integration.

Add the Puter script inside your root layout:

```html
<script src="https://js.puter.com/v2/"></script>
```

---

## Project Structure

```txt
app/
├── components/
├── routes/
├── lib/
├── constants/
├── styles/
└── types/
```

---

## Core Functionality

### Resume Upload

Users can upload PDF resumes using drag-and-drop functionality powered by React Dropzone.

### Resume Analysis

Uploaded resumes are analyzed using Claude Sonnet 4 through Puter AI integration.

### ATS Scoring

The platform generates ATS compatibility scores and detailed recommendations.

### Resume Tracking

All analyzed resumes are stored and accessible from the dashboard.

---

## AI Feedback Structure

CVertex evaluates resumes across multiple categories:

- ATS Compatibility
- Tone & Style
- Content Quality
- Resume Structure
- Skills Relevance

Each category includes:
- numerical scoring
- strengths
- improvement suggestions
- actionable explanations

---

## License

MIT License

---

## Author

Developed by Jairo Manzoni.