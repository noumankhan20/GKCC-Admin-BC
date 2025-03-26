import { parentPort } from 'worker_threads';
import sendEmail from './email.service.js';

// Listen for messages from the main thread
parentPort.on('message', async (data) => {
  try {
    const { email, subject, message } = data;

    // Send the email
    await sendEmail(email, subject, message);

    // Notify the main thread that the task is complete
    parentPort.postMessage({ success: true });
  } catch (error) {
    console.error('Error in email worker:', error);
    parentPort.postMessage({ success: false, error: error.message });
  }
});
