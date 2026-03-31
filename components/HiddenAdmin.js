// components/HiddenAdmin.js
import { useState } from 'react';

export default function HiddenAdmin() {
  const [step, setStep] = useState('idle'); // 'idle', 'prompt', or 'unlocked'
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // Handle the password guess
  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setStep('unlocked');
      setIsPanelOpen(true); // Pop open the panel immediately upon unlocking
    } else {
      window.location.reload(); // Wrong password? Insta-refresh.
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
        secretPassword: password // Send the password to backend for security
      }),
    });

    if (response.ok) {
      setStatus('✅ Sent!');
      setTimeout(() => {
        // Hide the panel after sending, but keep the toggle button visible
        setIsPanelOpen(false);
        setMessage('');
        setStatus('');
      }, 2000);
    } else {
      setStatus('❌ Failed to send.');
    }
  };

  return (
    <>
      {/* 1. THE INVISIBLE TRIGGER BUTTON */}
      {step === 'idle' && (
        <div 
          onClick={() => setStep('prompt')}
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0, // Change to 'left: 0' if you prefer bottom-left
            width: '50px',
            height: '50px',
            cursor: 'default', // Keeps the mouse from turning into a pointer so no one suspects it
            zIndex: 9999,
            // backgroundColor: 'rgba(255, 0, 0, 0.5)' // QUICK TIP: Uncomment this line to see the button while testing!
          }}
        />
      )}

      {/* 2. THE VISIBLE TOGGLE BUTTON (Shows only when password is correct) */}
      {step === 'unlocked' && !isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 9999
          }}
        >
          ⚙️ Admin Panel
        </button>
      )}

      {/* 3. THE POPUP OVERLAY (For both Password Prompt and Send Panel) */}
      {(step === 'prompt' || (step === 'unlocked' && isPanelOpen)) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '8px', 
            width: '400px', textAlign: 'center', color: '#000'
          }}>
            
            {/* PASSWORD PROMPT UI */}
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
                <button onClick={checkPassword} style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px', backgroundColor: '#000', color: '#fff', border: 'none' }}>
                  Verify
                </button>
                <button onClick={() => setStep('idle')} style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid #ccc', background: '#fff' }}>
                  Cancel
                </button>
              </>
            )}

            {/* SEND MESSAGE UI */}
            {step === 'unlocked' && isPanelOpen && (
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
                <button onClick={sendMessage} style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#0070f3', color: '#fff', border: 'none', marginBottom: '10px' }}>
                  Broadcast Message
                </button>
                <br />
                <button onClick={() => setIsPanelOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                  Hide Panel
                </button>
                {status && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{status}</p>}
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
