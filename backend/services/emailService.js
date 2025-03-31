const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    generateVerificationToken(userId) {
        return jwt.sign(
            { userId, purpose: 'email-verification' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async sendVerificationEmail(email, token) {
        const verificationUrl = `${process.env.BASE_URL}/frontend/auth/verify-email.html?token=${token}`;
        
        const mailOptions = {
            from: `"StaySync Solutions" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - StaySync Solutions',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1E3D59; text-align: center;">Welcome to StaySync Solutions!</h2>
                    
                    <p style="color: #34495e; line-height: 1.6;">
                        Thank you for registering. To complete your registration and access our vacation home
                        management platform, please verify your email by clicking the button below:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background: #17A2B8; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Verify Email
                        </a>
                    </div>

                    <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
                        If you didn't create an account with StaySync Solutions, please ignore this email.
                    </p>

                    <p style="color: #7f8c8d; font-size: 12px; text-align: center; margin-top: 30px;">
                        This verification link expires in 24 hours.
                    </p>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }

    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.BASE_URL}/frontend/auth/reset-password.html?token=${token}`;
        
        const mailOptions = {
            from: `"StaySync Solutions" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset - StaySync Solutions',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1E3D59; text-align: center;">Password Reset</h2>
                    
                    <p style="color: #34495e; line-height: 1.6;">
                        You requested to reset your password. Click the button below to
                        create a new password:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background: #17A2B8; color: white; padding: 12px 25px; 
                                  text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>

                    <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
                        If you didn't request a password reset, please ignore this email.
                    </p>

                    <p style="color: #7f8c8d; font-size: 12px; text-align: center; margin-top: 30px;">
                        This reset link expires in 1 hour.
                    </p>
                </div>
            `
        };

        return this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();
