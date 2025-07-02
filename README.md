# Chatly - Anonymous Chat Application

A secure, anonymous chat application built with React, Node.js, and WebSockets. Features include real-time messaging, room-based architecture, and complete privacy with no message persistence.

## Features

### 🛡️ Privacy & Security
- **Anonymous usernames** - Automatically generated (e.g., "MidnightVisitor23")
- **No message persistence** - All data wiped when last user leaves room
- **No user accounts** - Completely anonymous experience
- **Rate limiting** - Server-side protection against spam

### 💬 Chat Features
- **Real-time messaging** - WebSocket-based instant communication
- **Room-based architecture** - Private rooms with unique 8-character IDs
- **User limits** - Maximum 10 users per room
- **Typing indicators** - See when others are typing
- **Auto-cleanup** - Rooms automatically deleted when empty

### 🎨 UI/UX
- **Dark theme** - Custom color scheme for comfortable viewing
- **Animated background** - Floating dots with smooth animations
- **Responsive design** - Works on desktop and mobile
- **Smooth animations** - Framer Motion powered interactions
- **Modern aesthetics** - Clean, professional interface

### 🔧 Technical Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, WebSocket (ws library)
- **Real-time**: Pure WebSocket implementation
- **Styling**: Custom CSS with Tailwind utilities

## Color Scheme

The application uses a modern dark color palette with purple accents:
- **Primary Background**: `#111827` (Dark slate gray)
- **Chat Background**: `#1f2937` (Medium slate gray)
- **Accent Color**: `#818cf8` (Purple blue)
- **Accent Focus**: `#6366f1` (Darker purple)
- **Primary Text**: `#e5e7eb` (Light gray)
- **Secondary Text**: `#9ca3af` (Medium gray)
- **Timestamp**: `#9ca3af` (Medium gray)

The design features:
- **Glass morphism effects** with backdrop blur and transparency
- **Gradient backgrounds** for depth and visual appeal
- **Glow effects** on interactive elements
- **Smooth transitions** and animations throughout

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MistaaOlivaaa/Chatly.git
   cd chatly
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 3001) and frontend development server (port 5173).

### Manual Setup

If you prefer to install dependencies separately:

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Usage

1. **Open your browser** and navigate to `http://localhost:5173`
2. **Create a room** by clicking the "Create New Room" button
3. **Share the room URL** with others to invite them
4. **Start chatting** - messages appear in real-time
5. **Leave the room** by navigating away or closing the browser

## Project Structure

```
chatly/
├── server/                 # Backend Node.js server
│   ├── index.js           # Main server file with WebSocket logic
│   └── package.json       # Server dependencies
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── App.jsx
│   │   │   ├── Lobby.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── UserCounter.jsx
│   │   │   └── AnimatedBackground.jsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json           # Root package.json with scripts
└── README.md
```

## API Endpoints

### WebSocket Events

**Client to Server:**
- `create_room` - Create a new chat room
- `join_room` - Join an existing room
- `send_message` - Send a message to the room
- `typing` - Indicate typing status

**Server to Client:**
- `welcome` - Welcome message with user info
- `room_created` - Room creation confirmation
- `room_joined` - Room join confirmation
- `new_message` - New message from another user
- `user_joined` - User joined notification
- `user_left` - User left notification
- `error` - Error message

### HTTP Endpoints

- `GET /api/health` - Server health check
- `GET /api/rooms/:roomId` - Check if room exists

## Security Features

- **Rate limiting** - Prevents spam and abuse
- **Input validation** - Server-side message validation
- **CORS protection** - Configured for development and production
- **Helmet.js** - Security headers
- **No data persistence** - Messages never stored

## Development

### Available Scripts

**Root:**
- `npm run dev` - Start both servers concurrently
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install dependencies for all packages

**Backend:**
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=3001
NODE_ENV=development
```

## Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins in `server/index.js`
3. Deploy to your preferred hosting service (Heroku, Railway, etc.)

### Frontend Deployment

1. Update WebSocket URL in `client/src/hooks/useWebSocket.js`
2. Build the application: `cd client && npm run build`
3. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Review
![chatlyinterface](https://github.com/user-attachments/assets/026955b0-db8a-49bf-b593-201745cdff9a)
![chat](https://github.com/user-attachments/assets/3277d109-d0d4-47c8-8dbb-5d2f5fbca337)



## Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This application is designed for educational and personal use. Messages are not encrypted end-to-end and should not be used for sensitive communications. 
