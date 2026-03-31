// components/HiddenAdmin.js
import { useState, useEffect } from 'react';

export default function HiddenAdmin() {
  const [step, setStep] = useState('hidden'); // 'hidden', 'prompt', or 'panel'
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // Listen for Ctrl + `
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault(); // Stops the browser from doing weird things
        setStep('prompt');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle the password guess
  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setStep('panel'); // Unlock the panel
    } else {
      window.location.reload(); // Wrong password? Reload the page.
    }
  };

  // Send the actual message
  const sendMessage = async () => {
    setStatus('Sending...');
    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: message, 
        secretPassword: password // We send the password they typed to the backend too
      }),
    });

    if (response.ok) {
      setStatus('✅ Sent!');
      setTimeout(() => {
        // Hide everything after 2 seconds
        setStep('hidden');
        setMessage('');
        setStatus('');
      }, 2000);
    } else {
      setStatus('❌ Failed to send.');
    }
  };

  // If the step is 'hidden', render absolutely nothing
  if (step === 'hidden') return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '8px', 
        width: '400px', textAlign: 'center', color: '#000'
      }}>
        
        {step === 'prompt' && (
          <>
            <h2>Admin Login</h2>
            <input 
              type="password" 
              placeholder="Enter Password..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
              autoFocus
            />
            <button onClick={checkPassword} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Verify
            </button>
          </>
        )}

        {step === 'panel' && (
          <>
            <h2>Send Global Message</h2>
            <input 
              type="text" 
              placeholder="Type your message here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
              autoFocus
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
              Broadcast
            </button>
            <br />
            <button onClick={() => setStep('hidden')} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              Cancel & Close
            </button>
            {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
          </>
        )}

      </div>
    </div>
  );
}
