import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Attempt to reconnect after 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN) {
            connect();
          }
        }, 3000);
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket connection error:', err);
    }
  }, [url]);

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'welcome':
        setUserInfo({
          clientId: data.clientId,
          username: data.username
        });
        break;
      
      case 'room_created':
        setMessages(prev => [...prev, {
          id: 'system',
          type: 'system',
          content: `Room created: ${data.roomId}`,
          timestamp: Date.now()
        }]);
        break;
      
      case 'room_joined':
        setMessages(prev => [...prev, {
          id: 'system',
          type: 'system',
          content: `Joined room: ${data.roomId} (${data.userCount} users online)`,
          timestamp: Date.now()
        }]);
        // Load previous messages
        if (data.messages) {
          setMessages(prev => [...data.messages, ...prev]);
        }
        break;
      
      case 'new_message':
        setMessages(prev => [...prev, data.message]);
        break;
      
      case 'user_joined':
        setMessages(prev => [...prev, {
          id: 'system',
          type: 'system',
          content: `${data.username} joined the room (${data.userCount} users)`,
          timestamp: Date.now()
        }]);
        break;
      
      case 'user_left':
        setMessages(prev => [...prev, {
          id: 'system',
          type: 'system',
          content: `${data.username} left the room (${data.userCount} users)`,
          timestamp: Date.now()
        }]);
        break;
      
      case 'error':
        setError(data.message);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setError('Not connected to server');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    error,
    userInfo,
    sendMessage,
    disconnect,
    connect
  };
};

export default useWebSocket; 