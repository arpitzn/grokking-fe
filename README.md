# AI Agent Chat Frontend

A modern React frontend for the AI Agent backend, featuring real-time SSE streaming, thread history management, and RAG document upload capabilities.

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

## Features

- **Real-time Chat with SSE Streaming** - Token-by-token response streaming like ChatGPT
- **Thinking State Indicator** - Shows simulated progress phases before streaming
- **Thread History** - Manage multiple conversations
- **Knowledge Base Upload** - Drag-and-drop document upload for RAG
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Modern UI** - Clean, minimal design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USER_ID=demo_user
```

### Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── api/              # API layer (chat, threads, knowledge)
├── components/
│   ├── chat/         # Chat components (ChatPage, MessageBubble, etc.)
│   ├── threads/      # Thread sidebar components
│   ├── knowledge/    # Document upload panel
│   ├── layout/       # App layout
│   └── ui/           # Reusable UI primitives
├── hooks/            # Custom React hooks
├── store/            # Zustand global state
├── types/            # TypeScript interfaces
└── utils/            # Utility functions
```

## Backend API Integration

The frontend integrates with these backend endpoints:

| Endpoint                              | Method | Purpose            |
| ------------------------------------- | ------ | ------------------ |
| `/chat/stream`                        | POST   | SSE streaming chat |
| `/threads/{user_id}`                  | GET    | List conversations |
| `/threads/{conversation_id}/messages` | GET    | Get messages       |
| `/knowledge/upload`                   | POST   | Upload document    |
| `/knowledge/{user_id}`                | GET    | List documents     |

## UI Components

### Thinking Indicator

Shows simulated progress through phases:

1. "Understanding your question..." (800ms)
2. "Searching knowledge base..." (1500ms)
3. "Generating response..." (until stream starts)

### Chat Features

- Auto-scroll to new messages
- Streaming cursor animation
- Message bubbles with timestamps
- Disabled input during streaming

### Knowledge Panel

- Slide-out panel from right
- Drag-and-drop file upload
- Supports .txt and .md files
- Shows uploaded documents with chunk count

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## License

MIT
