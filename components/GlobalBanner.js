// components/GlobalBanner.js
'use client'; // (Required if using Next.js App Router)

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function GlobalBanner() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // 1. Connect to Pusher (Safe to put your public KEY and CLUSTER here)
    const pusher = new Pusher('YOUR_PUSHER_KEY', {
      cluster: 'YOUR_PUSHER_CLUSTER',
    });

    // 2. Subscribe to the global channel
    const channel = pusher.subscribe('global-channel');
    
    // 3. Listen for the 'new-message' event
    channel.bind('new-message', function(data) {
      setMessage(data.text);

      // 4. Hide the message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe('global-channel');
    };
  }, []);

  // If there's no message, don't render anything
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#3b82f6', // Nice blue color
      color: 'white',
      textAlign: 'center',
      padding: '12px',
      fontWeight: 'bold',
      zIndex: 9999, // Ensures it sits on top of everything else
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {message}
    </div>
  );
}
