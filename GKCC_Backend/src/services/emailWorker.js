import { parentPort, workerData } from 'worker_threads';
import nodemailer from 'nodemailer';

// Destructure email jobs from workerData
const { emailJobs } = workerData;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_CREDENTIALS_USER,
    pass: process.env.MAIL_CREDENTIALS_PASS,
  },
});

// Function to send email
const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.MAIL_CREDENTIALS_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    parentPort.postMessage(`Email sent to ${to}`);
  } catch (error) {
    parentPort.postMessage(`Error sending email to ${to}: ${error.message}`);
  }
};

// Process email jobs in sequence
const processEmails = async () => {
  for (const job of emailJobs) {
    await sendEmail(job);
  }
  parentPort.postMessage('All emails processed successfully.');
};

// Start processing emails
processEmails();
