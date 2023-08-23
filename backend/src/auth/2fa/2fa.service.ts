import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class SendEmailService {
    private transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'smtp-mail.outlook.com', // e.g., 'gmail' or 'smtp-mail.outlook.com'
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }
    async sendVerificationCode(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
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