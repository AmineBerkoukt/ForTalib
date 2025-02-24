export const generateEmailContent = (firstName, lastName, status, request) => {
    let subject = '';
    let htmlContent = '';

    if (status === 'accepted') {
        subject = 'Your Request Has Been Accepted';
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">Congratulations, ${firstName} ${lastName} !</h2>
                <p>Your request with ID <strong>${request._id}</strong> has been <strong style="color: #4CAF50;">accepted</strong>.</p>
                <p>You can now proceed with the next steps.</p>
                <br />
                <p style="font-size: 12px; color: #999;">If you have any questions, feel free to contact our support team.</p>
            </div>
        `;
    } else if (status === 'rejected') {
        subject = 'Your Request Has Been Rejected';
        htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #FF0000;">Hello, ${firstName} ${lastName} !</h2>
                <p>We regret to inform you that your request with ID <strong>${request._id}</strong> has been <strong style="color: #FF0000;">rejected</strong>.</p>
                <p>Please contact our support team for more details or to resolve any issues.</p>
                <br />
                <p style="font-size: 12px; color: #999;">Thank you for your understanding.</p>
            </div>
        `;
    }

    return { subject, htmlContent };
};


export const generatePasswordResetEmailContent = (firstName, lastName, resetLink) => {
    const subject = 'Password Reset Request';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2e359c;">Hello ${firstName} ${lastName}!</h2>
            <p>We have received a password reset request for your account.</p>
            <p>To reset your password, please click the link below:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2e359c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                Reset my password
            </a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, you can ignore this email.</p>
            <br />
            <p style="font-size: 12px; color: #999;">If you have any questions, feel free to contact our support team.</p>
        </div>
    `;
    return { subject, htmlContent };
};