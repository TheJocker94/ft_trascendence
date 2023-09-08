import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com', // Use the Outlook SMTP server
            port: 587, // The port for Outlook SMTP
            secure: false, // Set to false because we're using port 587
            auth: {
                user: process.env.MAIL_EMAIL, // Your Outlook email
                pass: process.env.MAIL_PASSWORD, // Your Outlook password
            },
        });
    }

    async sendVerificationCode(email: string, code: string): Promise<void> {
        console.log('Sending verification code to email', email, ' code:', code);
        const mailOptions = {
            from: process.env.MAIL_EMAIL, // Your Outlook email
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
