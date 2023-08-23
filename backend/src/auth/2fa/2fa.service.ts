import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Set up the transporter using your email provider's SMTP configuration
        this.transporter = nodemailer.createTransport({
            service: 'your-email-provider', // e.g., 'gmail' or 'smtp-mail.outlook.com'
            auth: {
                user: 'your-email@example.com', // Your email address
                pass: 'your-email-password', // Your email password
            },
        });
    }

    async sendVerificationCode(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: 'your-email@example.com', // Your email address
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${code}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Verification code email sent successfully');
        } catch (error) {
            console.error('Error sending verification code email:', error);
            throw new Error('Failed to send verification code email');
        }
    }

}
