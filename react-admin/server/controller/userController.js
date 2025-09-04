const userModel = require('../models/Usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.findOne({ email: email });

        if (user) {
 
            console.log('user already exists')
            return res.status(400).json({ message: 'user already exists' })
        } else {

            const newUser = new userModel({
                name: name,
                email: email,
                password: hashedPassword
            })
            await newUser.save();
            
            console.log('user registered successfully')
            return res.status(200).json({ message: 'user registered successfully' })
        }
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
                console.log(err)
                return res.status(500).json({ message: 'internal server error' })
            }
            if (result) {
                const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '1m' });

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

module.exports = {
    registerUser, loginUser
}