// api/send-message.js
const Pusher = require('pusher'); // <-- Changed from 'import' to 'require'

module.exports = async function handler(req, res) { // <-- Changed export syntax
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, secretPassword } = req.body;

  // 1. Verify the password matches the Vercel Env Var
  if (secretPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Wrong password' });
  }

  // 2. Setup Pusher using Vercel Env Vars
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });

  // 3. Send the message
  try {
    await pusher.trigger('global-channel', 'new-message', {
      text: text
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    // If it fails here, it WILL show up in Vercel logs now
    console.error("Pusher error:", error); 
    return res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};
