# Daymate Frontend

A modern React frontend application built with Vite, JavaScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## 🏗️ Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/       # Page components
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── hooks/       # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useFetch.js
│   ├── utils/       # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── assets/      # Images, fonts, etc.
│   ├── App.jsx      # Main App component
│   ├── main.jsx     # React entry point
│   └── index.css    # Global styles with Tailwind
├── index.html       # HTML entry point
├── vite.config.js   # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
└── .env.example     # Environment variables example
```

## 🎨 Tailwind CSS

This project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`.

## 📦 Technologies

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - Programming language

## 🧩 Components

The project includes several reusable components:

- **Button** - Customizable button component with multiple variants (primary, secondary, success, danger, outline)
- **Card** - Container component for content sections
- **Input** - Form input component with label and error handling
- **LoadingSpinner** - Loading indicator component

## 🎣 Custom Hooks

- **useLocalStorage** - Hook for managing localStorage with React state
- **useFetch** - Hook for fetching data from APIs

## 🛠️ Utilities

- **helpers.js** - Utility functions (date formatting, email validation, debounce, etc.)
- **constants.js** - Application constants and configuration

## 🔧 Development

The project is set up with hot module replacement (HMR), so changes will be reflected immediately in the browser.

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template) to configure environment-specific variables.

## 📝 Features

- ✅ React 18 with Hooks
- ✅ Tailwind CSS for styling
- ✅ Vite for fast development
- ✅ Reusable components
- ✅ Custom hooks
- ✅ Utility functions
- ✅ Form validation examples
- ✅ Responsive design
- ✅ Modern UI/UX

