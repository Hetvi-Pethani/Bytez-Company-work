const userModel = require('../models/Usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        console.log('User registered successfully');
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({
            email: email,

        });


        if (!user) {
            console.log('user not found')
            return res.status(400).json({ message: 'user not found' })
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {

                return res.status(500).json({ message: 'internal server error' })
            }
            if (result) {
                const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '3h' });

                console.log('user logged in successfully')
                return res.status(200).json({ message: 'user logged in successfully', token: token })
            } else {
                console.log('invalid credentials')
                return res.status(400).json({ message: 'invalid credentials' })
            }
        }
        )

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'internal server error' })
    }
}

const otpPage = async (req, res) => {
    try {
        const { otp } = req.body;
        const newUser = await userModel.findOne({
            otp: otp,
        });
        if (!newUser) {
            console.log('Invalid OTP');
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        console.error('Error rendering OTP page:', err);
        return res.status(500).send('Error loading OTP page');
    }
};

const forgotPassword = async (req, res) => {
    try {

        const email = req.body.email;

        const newUser = await userModel.findOne({
            email: email

        });

        if (!newUser) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hetvi.pethani75@gmail.com',
                pass: 'qqaneszrncyagjjb',
            },
        });

        // Email content
        const mailOptions = {
            from: '"Your App Name"<hetvi.pethani75@gmail.com>',
            to: email,
            subject: 'OTP for Password Reset',
            html: `
                <h2 style="color: #007BFF;">Your OTP is: ${otp}</h2>
            `,
        };
        // Send email
        await transporter.sendMail(mailOptions);

        // Store email + OTP in secure cookie
        res.cookie('newUser', JSON.stringify({ email, otp }), {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 5 * 60 * 1000,
        });

        return res.status(200).json({ message: 'OTP sent to email', redirect: true });

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const userOtp = async (req, res) => {
    try {
        const otp = req.body.otp;

        const userCookie = req.cookies.newUser;

        if (!userCookie) {
            console.log("Cookie not found");
            return res.status(400).json({ message: 'OTP cookie not found' });
        }

        const { otp: storedOtp } = JSON.parse(userCookie);

        if (storedOtp == otp) {
            return res.status(200).json({ message: 'OTP matched' });
        } else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

const usernewPassword = async (req, res) => {
    try {
        const { newpass, cpass } = req.body;

        if (!newpass || !cpass) {
            return res.status(400).json({ message: 'Both password fields are required.' });
        }
        const rawCookie = req.cookies?.newUser;
        if (!rawCookie) {
            return res.status(401).json({ message: 'Session expired. Please request a new OTP.' });
        }

        let userCookie;
        try {
            userCookie = JSON.parse(rawCookie);
        } catch (error) {
            return res.status(400).json({ message: 'Invalid cookie format.' });
        }

        const email = userCookie?.email;
        if (!email) {
            return res.status(401).json({ message: 'Invalid session. Email not found.' });
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);

        const updatedUser = await userModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Clear cookie
        res.clearCookie('newUser');

        return res.status(200).json({ message: 'Password updated successfully. Please log in.' });
    } catch (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Server error during password update.' });
    }
};

module.exports = {
    registerUser, loginUser, forgotPassword, usernewPassword, userOtp, otpPage
}


