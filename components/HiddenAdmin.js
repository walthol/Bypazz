// components/HiddenAdmin.js
import { useState } from 'react';

export default function HiddenAdmin() {
  const [step, setStep] = useState('idle'); // 'idle', 'prompt', or 'unlocked'
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // 1. Check the password
  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setStep('unlocked');
      setIsPanelOpen(true);
    } else {
      window.location.reload(); // Insta-refresh on wrong guess
    }
  };

  // 2. Send the message to the API
  const sendMessage = async () => {
    setStatus('Sending...');
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: message, 
          secretPassword: password 
        }),
      });

      if (response.ok) {
        setStatus('✅ Broadcast sent!');
        setTimeout(() => {
          setIsPanelOpen(false); // Close panel but keep the unlocked toggle
          setMessage('');
          setStatus('');
        }, 2000);
      } else {
        setStatus('❌ Failed. Check your Vercel logs.');
      }
    } catch (error) {
      setStatus('❌ Network error.');
    }
  };

  return (
    <>
      {/* --- THE SUBTLE LOCK ICON --- */}
      {step === 'idle' && (
        <button 
          onClick={() => setStep('prompt')}
          style={{
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.1)', // Very faint background
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 999999, // Absurdly high to prevent getting blocked
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
          }}
          title="Admin Area"
        >
          🔒
        </button>
      )}

      {/* --- THE UNLOCKED TOGGLE BUTTON --- */}
      {step === 'unlocked' && !isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          style={{
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 999999,
          }}
        >
          ⚙️ Open Panel
        </button>
      )}

      {/* --- THE POPUP OVERLAY --- */}
      {(step === 'prompt' || (step === 'unlocked' && isPanelOpen)) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '12px', 
            width: '90%', maxWidth: '400px', textAlign: 'center', color: '#000',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            
            {/* PASSWORD PROMPT */}
            {step === 'prompt' && (
              <>
                <h2 style={{ marginTop: 0 }}>Admin Access</h2>
                <input 
                  type="password" 
                  placeholder="Enter Password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                  style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={checkPassword} style={{ flex: 1, padding: '12px', cursor: 'pointer', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    Verify
                  </button>
                  <button onClick={() => setStep('idle')} style={{ flex: 1, padding: '12px', cursor: 'pointer', border: '1px solid #ccc', background: '#f9f9f9', borderRadius: '6px', color: '#333' }}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* SEND MESSAGE PANEL */}
            {step === 'unlocked' && isPanelOpen && (
              <>
                <h2 style={{ marginTop: 0 }}>Broadcast Message</h2>
                <input 
                  type="text" 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  autoFocus
                />
                <button onClick={sendMessage} style={{ width: '100%', padding: '12px', cursor: 'pointer', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '15px' }}>
                  Send to Everyone
                </button>
                <button onClick={() => setIsPanelOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}>
                  Close Panel
                </button>
                {status && <p style={{ marginTop: '15px', fontWeight: 'bold', color: status.includes('❌') ? 'red' : 'green' }}>{status}</p>}
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
