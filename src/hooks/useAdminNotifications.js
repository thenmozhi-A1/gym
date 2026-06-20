import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Users, CreditCard, Clock } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

let API_BASE;
if (import.meta.env.VITE_API_BASE) {
  API_BASE = import.meta.env.VITE_API_BASE;
} else if (import.meta.env.DEV) {
  API_BASE = 'https://gymj-9.onrender.com/api';
} else {
  API_BASE = 'https://gymj-9.onrender.com/api';
}

if (!API_BASE.endsWith('/api')) {
  API_BASE = API_BASE.endsWith('/') ? API_BASE + 'api' : API_BASE + '/api';
}

/**
 * Subscribes to the backend SSE stream and pushes toast notifications
 * when admin-relevant events arrive (new member, payment failed, attendance).
 *
 * @param {function} onNotification  Called with each event { type, payload, timestamp }
 *                                   so the caller can update badge counts etc.
 */
export function useAdminNotifications(onNotification) {
  const esRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(async () => {
    try {
      // Fetch a short-lived ticket to authenticate the SSE connection
      const res = await axiosInstance.post('/notifications/ticket');
      const ticket = res.data?.ticket;
      
      const url = ticket
        ? `${API_BASE}/notifications/stream?ticket=${encodeURIComponent(ticket)}`
        : `${API_BASE}/notifications/stream`;

      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.addEventListener('CONNECTED', () => {
        // Stream open — clear any pending reconnect timers
        if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      });

      es.addEventListener('NEW_MEMBER', (e) => {
        const data = JSON.parse(e.data);
        toast.success(
          `New member signed up: ${data.payload?.name || 'Unknown'}`,
          { icon: '👤', duration: 6000, id: `nm-${data.timestamp}` }
        );
        onNotification?.({ type: 'NEW_MEMBER', ...data });
      });

      es.addEventListener('PAYMENT_FAILED', (e) => {
        const data = JSON.parse(e.data);
        toast.error(
          `Payment failed — ₹${data.payload?.amount || 0} (User #${data.payload?.user})`,
          { duration: 8000, id: `pf-${data.timestamp}` }
        );
        onNotification?.({ type: 'PAYMENT_FAILED', ...data });
      });

      es.addEventListener('ATTENDANCE', (e) => {
        const data = JSON.parse(e.data);
        toast(
          `${data.payload?.name || 'Member'} checked in at ${data.payload?.time}`,
          { icon: '🏋️', duration: 4000, id: `att-${data.timestamp}` }
        );
        onNotification?.({ type: 'ATTENDANCE', ...data });
      });

      es.addEventListener('FEEDBACK', (e) => {
        const data = JSON.parse(e.data);
        toast.success(
          `New feedback from ${data.payload?.name || 'Anonymous'}`,
          { icon: '⭐', duration: 5000, id: `fb-${data.timestamp}` }
        );
        onNotification?.({ type: 'FEEDBACK', ...data });
      });

      es.addEventListener('ENQUIRY', (e) => {
        const data = JSON.parse(e.data);
        toast(
          `New Enquiry from ${data.payload?.name || 'Someone'}`,
          { icon: '📞', duration: 5000, id: `enq-${data.timestamp}` }
        );
        onNotification?.({ type: 'ENQUIRY', ...data });
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        // Auto-reconnect after 5 seconds
        reconnectTimer.current = setTimeout(connect, 5000);
      };
    } catch (err) {
      console.error("Failed to get SSE ticket", err);
      // Auto-reconnect
      reconnectTimer.current = setTimeout(connect, 5000);
    }
  }, [onNotification]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);
}
