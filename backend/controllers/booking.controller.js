const { sendEmail } = require('../mail.service');

exports.createBookingRequest = async (req, res) => {
    try {
        const { student, counselor, slot, topic } = req.body;

        if (!student || !counselor || !slot) {
            return res.status(400).json({ message: 'Missing booking details' });
        }

        const subject = `New Booking Request: ${student.name} with ${counselor.name}`;
        const textBody = `A new consultation session has been requested.\n\nStudent: ${student.name} (${student.email})\nCounselor: ${counselor.name}\nSelected Slot: ${slot}\nTopic: ${topic || 'Not specified'}\n\nPlease follow up with the student to confirm the booking.`;
        const htmlBody = `
            <h2>New Consultation Request</h2>
            <p><strong>Student:</strong> ${student.name} (${student.email})</p>
            <p><strong>Counselor:</strong> ${counselor.name}</p>
            <p><strong>Requested Slot:</strong> ${slot}</p>
            <p><strong>Topic:</strong> ${topic || 'Not specified'}</p>
            <hr>
            <p>Please follow up with the student to confirm the booking and payment.</p>
        `;

        await sendEmail({ 
            to: process.env.CONTACT_FORM_RECIPIENT, 
            subject, 
            text: textBody, 
            html: htmlBody,
            replyTo: student.email // Add the student's email as the reply-to address
        });

        res.status(200).json({ message: 'Booking request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send booking request' });
    }
};