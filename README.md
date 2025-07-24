# Financial Blog - Hebrew

A modern financial blog application built with React and Vite, featuring an admin dashboard for content management.

## Features

- 📝 **Blog Management**: Create, edit, and manage blog posts
- 🏷️ **Category System**: Organize posts by categories
- 👨‍💼 **Admin Dashboard**: Complete admin interface for content management
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- 💾 **Local Storage**: Client-side data persistence
- 🔐 **Admin Authentication**: Secure admin login system

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Tailwind CSS Animate
- **UI Components**: Radix UI (Dialog, Dropdown, Toast, etc.)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: Local Storage API

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── Header.jsx      # Site header
│   │   └── StorageManager.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Main blog page
│   │   ├── CategoryPage.jsx
│   │   ├── BlogPost.jsx
│   │   ├── CreatePost.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── AdminCategories.jsx
│   ├── lib/                # Utility functions
│   │   ├── storage.js      # Local storage utilities
│   │   └── utils.js        # General utilities
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── plugins/               # Custom Vite plugins
├── public/               # Static assets
└── tools/               # Build tools
```

## Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/idantr/not-a-recommendation.git
cd not-a-recommendation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Admin Access

The application includes an admin dashboard for managing blog content. Access the admin panel through the login page and use the admin credentials to manage posts and categories.

## Features Overview

### Public Features
- Browse blog posts by category
- Read individual blog posts
- Responsive design for mobile and desktop

### Admin Features
- Create and edit blog posts
- Manage categories
- Admin dashboard with analytics
- Content management system

## Development

The project uses modern React patterns and includes:
- React Router for navigation
- Custom hooks for state management
- Local storage for data persistence
- Responsive design with Tailwind CSS
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and not licensed for public use.
