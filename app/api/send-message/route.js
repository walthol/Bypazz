// app/api/send-message/route.js (Next.js App Router example)
import Pusher from 'pusher';
import { NextResponse } from 'next/server';

// Initialize Pusher securely on the server
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { text, secretPassword } = body;

    // VERY IMPORTANT: Prevent random people from sending messages
    if (secretPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Broadcast the message to everyone listening to 'global-channel'
    await pusher.trigger('global-channel', 'new-message', {
      text: text,
    });

    return NextResponse.json({ success: true, message: 'Broadcast sent!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
