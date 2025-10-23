# TodoOrNot

> Keeps your hours in check, and ruins your excuses

A modern, responsive task management application with AI-powered text enhancement and time tracking capabilities.

## Features

- **📝 Smart Task Management**: Create, organize, and manage tasks with drag-and-drop functionality
- **🤖 AI Enhancement**: Enhance task descriptions using Gemini AI with different modes:
  - General text improvement
  - Technical specification formatting
  - Bug report structuring
  - AI prompt optimization
- **⏱️ Time Tracking**: Built-in timer system with start/pause/complete functionality
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🎨 Theme Support**: Light and dark mode with automatic logo adaptation
- **🏷️ Color Coding**: Organize tasks with customizable color labels
- **📊 Priority Management**: Mark lists as important or urgent with visual indicators
- **💾 Auto-Save**: Automatic persistence with localStorage

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **UI Components**: Radix UI, Lucide React
- **Drag & Drop**: @dnd-kit
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd IntelligentTodo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── pages/          # Page components
│   └── public/             # Static assets
├── server/                 # Backend Express server
│   ├── gemini.ts          # AI integration service
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
└── shared/                # Shared TypeScript types
```

## Features Overview

### Task Management
- Create unlimited task lists
- Drag and drop tasks between lists
- Color-code tasks for better organization
- Mark tasks as completed with visual indicators

### AI Enhancement
- Enhance task titles and descriptions separately
- Multiple enhancement modes for different use cases
- Rate limiting with automatic fallback models
- Clean text processing to remove AI verbosity

### Time Tracking
- Start/pause/complete timers for individual tasks
- Real-time timer updates across the application
- Aggregate time tracking per list
- Persistent timer state

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized performance on mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Environment Variables

The following environment variables are required:

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (optional, defaults to 5000)

See `.env.example` for reference.

## Author

Zakaria Benayoub (benayoubzakaria@gmail.com)