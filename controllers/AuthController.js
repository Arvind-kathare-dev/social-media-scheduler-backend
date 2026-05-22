import User from '../models/User.js';
import responseHandler from '../utils/responseHandler.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Temporary in-memory store for OTPs (email -> { otp, expiry })
// In production, consider using Redis or adding columns to the users table
const otpStore = new Map();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class AuthController {
    static async registerAdmin(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return responseHandler.validationError(res, 'Name, email, and password are required', 400);
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return responseHandler.validationError(res, 'User with this email already exists', 400);
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create admin user
            const newAdmin = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin',
                is_active: true
            });

            // Remove password from response
            const { password: _, ...adminData } = newAdmin;

            return responseHandler.success(res, 'Admin registered successfully', adminData, 201);
        } catch (error) {
            console.error('Error during admin registration:', error);
            return responseHandler.error(res, 'Failed to register admin', error.message, 500);
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return responseHandler.validationError(res, 'Email and password are required', 400);
            }

            const user = await User.findByEmail(email);

            if (!user) {
                return responseHandler.unauthorized(res, 'Invalid email or password', 401);
            }

            if (!user.is_active) {
                return responseHandler.unauthorized(res, 'Account is deactivated', 401);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password || '');

            if (!isPasswordValid) {
                return responseHandler.unauthorized(res, 'Invalid email or password', 401);
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET_KEY || 'default_secret',
                { expiresIn: '24h' }
            );

            const { password: _, ...userData } = user;

            return responseHandler.success(res, 'Login successful', { token, user: userData }, 200);
        } catch (error) {
            console.error('Error during login:', error);
            return responseHandler.error(res, 'Login failed', error.message, 500);
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return responseHandler.validationError(res, 'Email is required', 400);
            }

            const user = await User.findByEmail(email);

            if (!user) {
                // Return success even if user not found to prevent email enumeration
                return responseHandler.success(res, 'If your email is registered, an OTP has been sent.', null, 200);
            }

            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store OTP with 10 minutes expiry
            const expiry = Date.now() + 10 * 60 * 1000;
            otpStore.set(email, { otp, expiry });

            console.log(`[MOCK OTP] Password reset OTP for ${email}: ${otp}`);

            // Send email
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const mailOptions = {
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset OTP',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
                        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    `
                };
                
                await transporter.sendMail(mailOptions);
            } else {
                console.warn('EMAIL_USER or EMAIL_PASS not set in .env, skipping actual email sending. Check console for OTP.');
            }

            return responseHandler.success(res, 'If your email is registered, an OTP has been sent.', null, 200);
        } catch (error) {
            console.error('Error during forgot password:', error);
            return responseHandler.error(res, 'Failed to process forgot password request', error.message, 500);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;

            if (!email || !otp || !newPassword) {
                return responseHandler.validationError(res, 'Email, OTP, and new password are required', 400);
            }

            const storedData = otpStore.get(email);

            if (!storedData) {
                return responseHandler.validationError(res, 'Invalid or expired OTP', 400);
            }

            if (Date.now() > storedData.expiry) {
                otpStore.delete(email);
                return responseHandler.validationError(res, 'OTP has expired. Please request a new one.', 400);
            }

            if (storedData.otp !== otp) {
                return responseHandler.validationError(res, 'Invalid OTP', 400);
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return responseHandler.notFound(res, 'User not found', 404);
            }

            // Hash new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update user password
            await User.update(user.id, { password: hashedPassword });

            // Clear OTP after successful reset
            otpStore.delete(email);

            return responseHandler.success(res, 'Password reset successfully. You can now login with your new password.', null, 200);
        } catch (error) {
            console.error('Error during password reset:', error);
            return responseHandler.error(res, 'Failed to reset password', error.message, 500);
        }
    }
}

export default AuthController;
