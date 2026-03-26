import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface Report {
  id: number;
  description: string;
  lieu: string;
  statut: string;
  created_at: string;
  user: {
    id: number;
    nom: string;
    email: string;
  };
  like: number;
}

interface WebSocketMessage {
  type: 'new_report' | 'report_updated' | 'report_status_changed' | 'unread_count' | 'error';
  report?: Report;
  report_id?: number;
  old_status?: string;
  new_status?: string;
  count?: number;
  message?: string;
}

export const useReportWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found, cannot connect to WebSocket');
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/reports/?token=${token}`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Report WebSocket connected');
        setIsConnected(true);
        
        // Demander le nombre de reports non lus
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'get_unread_count'
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          switch (message.type) {
            case 'new_report':
              console.log('New report received:', message.report);
              // Rafraîchir les queries de reports
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              queryClient.invalidateQueries({ queryKey: ['recent-reports'] });
              queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
              
              // Incrémenter le compteur non lu
              setUnreadCount(prev => prev + 1);
              break;

            case 'report_updated':
              console.log('Report updated:', message.report);
              // Rafraîchir les queries de reports
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              queryClient.invalidateQueries({ queryKey: ['my-reports'] });
              break;

            case 'report_status_changed':
              console.log('Report status changed:', message);
              // Rafraîchir les queries de reports
              queryClient.invalidateQueries({ queryKey: ['reports'] });
              queryClient.invalidateQueries({ queryKey: ['my-reports'] });
              queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
              break;

            case 'unread_count':
              setUnreadCount(message.count || 0);
              break;

            case 'error':
              console.error('WebSocket error:', message.message);
              break;

            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('Report WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Tentative de reconnexion après 5 secondes
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect to Report WebSocket...');
          connect();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('Report WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to create Report WebSocket connection:', error);
    }
  }, [queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const markAsRead = useCallback((reportId: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mark_read',
        report_id: reportId
      }));
      
      // Décrémenter le compteur localement
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const refreshUnreadCount = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'get_unread_count'
      }));
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    unreadCount,
    lastMessage,
    markAsRead,
    refreshUnreadCount,
    disconnect,
    reconnect: connect
  };
};
