// pages/admin-glow.js (or app/admin-glow/page.js)
'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [msg, setMsg] = useState('');
  const [pass, setPass] = useState('');

  const send = async () => {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      body: JSON.stringify({ text: msg, secretPassword: pass }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.ok) alert("Sent successfully!");
    else alert("Failed to send. Check password.");
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Global Message Broadcaster</h2>
      <input 
        type="text" 
        placeholder="Message content..." 
        onChange={(e) => setMsg(e.target.value)} 
      /><br/><br/>
      <input 
        type="password" 
        placeholder="Admin Password" 
        onChange={(e) => setPass(e.target.value)} 
      /><br/><br/>
      <button onClick={send}>Broadcast to Everyone</button>
    </div>
  );
}
