# Portfolio Site

A portfolio website built with Preact and Tailwind CSS, designed with a neo-skeuomorphic aesthetic.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Run development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

## GitHub Pages Deployment

The site uses hash-based routing (`#/path`) for GitHub Pages compatibility. After building, deploy the `dist` folder to GitHub Pages.

## Assets

Place your resume PDF at `public/assets/resume.pdf` (or update the path in `src/pages/Resume.jsx`).

Replace placeholder project images and data in `src/pages/Projects.jsx` and `src/pages/ProjectDetail.jsx` with your actual projects.
