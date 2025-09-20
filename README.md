
# Engineering Hub - Student Study Platform

A modern React-based platform for engineering students to access study materials, syllabi, and past year questions.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install dependencies
```bash
npm install
```

If you encounter dependency conflicts, try:
```bash
npm install --legacy-peer-deps
```

### 3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## VS Code Setup

This project includes VS Code configuration files for optimal development experience:

1. Install the recommended extensions when prompted
2. Enable format on save for consistent code formatting
3. ESLint will automatically check for code issues

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── data/               # Static data and configurations
├── lib/                # Utility functions
└── services/           # API services
```

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Router** - Navigation
- **Lucide React** - Icons

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

The project can be deployed to any static hosting service:

1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Ensure all TypeScript types are properly defined
4. Test your changes in both development and production builds

## Troubleshooting

### Dependency Issues
If you encounter npm install errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install --legacy-peer-deps`

### VS Code Issues
1. Restart VS Code after initial setup
2. Run "TypeScript: Reload Project" command if types aren't working
3. Ensure all recommended extensions are installed
