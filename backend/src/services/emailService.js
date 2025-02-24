import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};
