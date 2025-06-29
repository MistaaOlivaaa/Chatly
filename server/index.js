const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// In-memory storage
const rooms = new Map();
const clients = new Map();

// Generate unique room ID
function generateRoomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate anonymous username
function generateUsername() {
  const adjectives = [
    'Midnight', 'Shadow', 'Mystic', 'Silent', 'Hidden', 'Secret', 'Unknown',
    'Phantom', 'Ghost', 'Echo', 'Whisper', 'Veil', 'Mask', 'Cipher'
  ];
  const nouns = [
    'Visitor', 'Wanderer', 'Traveler', 'Observer', 'Spectator', 'Witness',
    'Presence', 'Entity', 'Being', 'Soul', 'Spirit', 'Shadow', 'Echo'
  ];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100);
  
  return `${adj}${noun}${num}`;
}

// Clean up empty rooms
function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (room && room.clients.size === 0) {
    rooms.delete(roomId);
    console.log(`Room ${roomId} cleaned up`);
  }
}

// Broadcast to room
function broadcastToRoom(roomId, message, excludeClient = null) {
  const room = rooms.get(roomId);
  if (room) {
    room.clients.forEach(client => {
      if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const clientId = Math.random().toString(36).substr(2, 9);
  const username = generateUsername();
  
  clients.set(clientId, {
    ws,
    username,
    roomId: null
  });

  console.log(`Client connected: ${username} (${clientId})`);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId,
    username
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'create_room':
          const roomId = generateRoomId();
          const room = {
            id: roomId,
            clients: new Set([ws]),
            messages: [],
            createdAt: Date.now()
          };
          
          rooms.set(roomId, room);
          clients.get(clientId).roomId = roomId;
          
          ws.send(JSON.stringify({
            type: 'room_created',
            roomId,
            roomUrl: `${req.headers.origin}/room/${roomId}`
          }));
          
          console.log(`Room created: ${roomId} by ${username}`);
          break;

        case 'join_room':
          const targetRoom = rooms.get(message.roomId);
          if (!targetRoom) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Room not found'
            }));
            return;
          }
          
          if (targetRoom.clients.size >= 10) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Room is full (max 10 users)'
            }));
            return;
          }
          
          // Leave current room if any
          const currentClient = clients.get(clientId);
          if (currentClient.roomId && rooms.has(currentClient.roomId)) {
            const currentRoom = rooms.get(currentClient.roomId);
            currentRoom.clients.delete(ws);
            broadcastToRoom(currentClient.roomId, {
              type: 'user_left',
              username,
              userCount: currentRoom.clients.size
            }, ws);
            cleanupRoom(currentClient.roomId);
          }
          
          // Join new room
          targetRoom.clients.add(ws);
          currentClient.roomId = message.roomId;
          
          // Send room info
          ws.send(JSON.stringify({
            type: 'room_joined',
            roomId: message.roomId,
            userCount: targetRoom.clients.size,
            messages: targetRoom.messages.slice(-50) // Last 50 messages
          }));
          
          // Notify others
          broadcastToRoom(message.roomId, {
            type: 'user_joined',
            username,
            userCount: targetRoom.clients.size
          }, ws);
          
          console.log(`${username} joined room ${message.roomId}`);
          break;

        case 'send_message':
          const client = clients.get(clientId);
          if (!client.roomId || !rooms.has(client.roomId)) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Not in a room'
            }));
            return;
          }
          
          const chatRoom = rooms.get(client.roomId);
          const chatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            content: message.content,
            timestamp: Date.now(),
            encrypted: message.encrypted || false
          };
          
          chatRoom.messages.push(chatMessage);
          
          // Keep only last 100 messages
          if (chatRoom.messages.length > 100) {
            chatRoom.messages = chatRoom.messages.slice(-100);
          }
          
          broadcastToRoom(client.roomId, {
            type: 'new_message',
            message: chatMessage
          });
          
          console.log(`Message in ${client.roomId}: ${username}: ${message.content.substring(0, 50)}...`);
          break;

        case 'typing':
          const typingClient = clients.get(clientId);
          if (typingClient.roomId) {
            broadcastToRoom(typingClient.roomId, {
              type: 'user_typing',
              username,
              isTyping: message.isTyping
            }, ws);
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    const client = clients.get(clientId);
    if (client && client.roomId) {
      const room = rooms.get(client.roomId);
      if (room) {
        room.clients.delete(ws);
        broadcastToRoom(client.roomId, {
          type: 'user_left',
          username,
          userCount: room.clients.size
        });
        cleanupRoom(client.roomId);
      }
    }
    
    clients.delete(clientId);
    console.log(`Client disconnected: ${username} (${clientId})`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size, 
    clients: clients.size,
    timestamp: Date.now()
  });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (room) {
    res.json({
      exists: true,
      userCount: room.clients.size,
      createdAt: room.createdAt
    });
  } else {
    res.json({ exists: false });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 