import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your preferred email service
    auth: {
        user: process.env.MAIL_CREDENTIALS_USER,
        pass: process.env.MAIL_CREDENTIALS_PASS,
    },
});

// Function to add delay (in milliseconds)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to send an email
const sendEmail = async (to, subject, text, delayMs = 180000) => { // Add delayMs argument for flexibility
    // Validate input
    if (!to || !subject || !text) {
        console.error('Invalid email parameters:', { to, subject, text });
        throw new Error('Email parameters are missing');
    }

    const mailOptions = {
        from: process.env.MAIL_CREDENTIALS_USER,
        to,
        subject,
        text,
    };

    console.log(mailOptions);

    try {
        // Introduce delay before sending each email
        await delay(delayMs); // Delay in milliseconds (1000ms = 1 second)

        // Send the email
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Email sending error:', error); // Log the error for debugging
        return { success: false, message: 'Failed to send email', error: error.message }; // Return the error message
    }
}

export default sendEmail;
