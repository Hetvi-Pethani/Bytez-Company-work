const User = require('../models/UserModel')

const nodemailer = require('nodemailer');

const loginPage = (req, res) => {
    if (res.locals?.users) {
        return res.redirect('/deshboard')
    }
    return res.render('login')
}

const registerPage = (req, res) => {
    return res.render('register')
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        console.log("user created")
        return res.redirect('/')
    } catch (err) {
        console.log(err)
        return false
    }
}


const loginUser = async (req, res) => {
    try {
        return res.redirect('/deshboard')
    } catch (err) {
        console.log(err)
        return false;
    }
}

const deshboardPage = async (req, res) => {
    try {
        return res.render('deshboard')
    } catch (err) {
        console.log(err)
        return false
    }
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return false
        }
        return res.redirect('/')
    })
}

//forgot password

const otpPage = async (req, res) => {
    try {
        return res.render('otp')
    } catch (err) {
        console.log(err)
        return false
    }
}

const newpasswordPage = async (req, res) => {
    try {
        return res.render('newpassword')
    } catch (err) {
        console.log(err)
        return false
    }
}

const forgotPassword = async (req, res) => {
    try {
        let useremail = req.body.useremail;

        const user = await User.findOne({ email: useremail })

        if (!user) {
            console.log('User is not found');
            return res.redirect('/');
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Configure transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hetvi.pethani75@gmail.com',
                pass: 'umlyvpjmyqqwkgwi'
            }
        });

        // Email options
        const mailOptions = {
            from: 'hetvi.pethani75@gmail.com',
            to: useremail,
            subject: 'OTP for password reset',
            html: `<h2 style="color: #007BFF;">Your OTP is: ${otp}</h2>`
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);

                // Store the OTP in a cookie
                const auth = { email: useremail, otp: otp };
                res.cookie('user', JSON.stringify(auth), {
                    httpOnly: true,
                    maxAge: 5 * 60 * 1000 // Cookie expires in 5 minutes
                });

                return res.redirect('/otp');
            }
        });
    } catch (err) {
        console.log(err)
        return false
    }
}

const userOtp = async (req, res) => {
    try {
        // Get OTP from request body
        const otp = req.body.otp;

        // Get OTP from cookies
        const userCookie = req.cookies?.user;


        const { otp: storedOtp } = JSON.parse(userCookie);

        // Compare the OTPs
        if (storedOtp == otp) {
            console.log('OTP matched');
            return res.redirect('/newpassword');
        } else {
            console.log('OTP did not match');
            return res.redirect('/otp');
        }
    } catch (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};


const usernewPassword = async (req, res) => {
    try {
        const { newpass, cpass } = req.body;

        // Check if passwords match
        if (newpass !== cpass) {
            console.log('Passwords do not match');
            req.flash('error', 'Passwords do not match');
            return res.redirect('/newpassword');
        }

        // Parse the user cookie
        const userCookie = JSON.parse(req.cookies?.user || '{}');
        const email = userCookie?.email;

        if (!email) {
            console.log('No user email found in cookie');
            req.flash('error', 'Session expired. Please request a new OTP.');
            return res.redirect('/forgot-password');
        }

        // Update the user's password
        const user = await User.findOneAndUpdate(
            { email: email },
            { password: newpass },
            { new: true }
        );

        if (!user) {
            console.log('User not found');
            req.flash('error', 'User not found');
            return res.redirect('/forgot-password');
        }

        // Clear the user cookie
        res.clearCookie('user');

        req.flash('success', 'Password updated successfully. Please log in.');
        return res.redirect('/');
    } catch (err) {
        console.error('Error updating password:', err);
        req.flash('error', 'An error occurred while updating your password. Please try again.');
        return res.redirect('/newpassword');
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({ name: { $regex: query, $options: ' i' } });
        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ message: 'Error searching users' });
    }

}

module.exports = {
    loginPage, registerPage, registerUser, loginUser, deshboardPage, logout, otpPage, newpasswordPage, forgotPassword, userOtp, usernewPassword,searchUsers
}