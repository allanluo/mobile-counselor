const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text body of the email.
 * @param {string} html - The HTML body of the email.
 * @param {string} [replyTo] - Optional reply-to address.
 */
const sendEmail = async ({ to, subject, text, html, replyTo }) => {
    try {
        await transporter.sendMail({
            from: `"AdmissionAI Notifier" <${process.env.EMAIL_USER}>`, // This must be the authenticated user
            replyTo: replyTo, // Set the user's email as the reply-to address
            to, subject, text, html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

module.exports = { sendEmail };