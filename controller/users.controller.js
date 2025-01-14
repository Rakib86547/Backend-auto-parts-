const User = require("../models/User");
const nodemailer = require("nodemailer");
const { signUpService, existUserService } = require("../service/users.service");
const bcrypt = require('bcryptjs');
const { generateJwtToken } = require("../utilities/jwt-token");


// Register Logic
exports.signUp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const userData = req.body;
        const image = req.file ? req.file.path : null
        const userInfo = {
            name: userData?.name,
            email: userData?.email,
            password: userData?.password,
            image: image
        };
        // console.log(userInfo)
        // GENERATE JWT TOKEN
        const jwt_token = generateJwtToken(userData);

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).send({ message: 'email already exist' })
        }

        const userCreated = await User.create(userInfo);
        const users = {
            name: userCreated?.name,
            email: userCreated?.email,
            image: userCreated?.image,
            _id: userCreated?._id,
            createdAt: userCreated?.createdAt,
            updatedAt: userCreated?.updatedAt

        }
        res.status(200).send({
            status: 'success',
            message: "Signup Success",
            token: jwt_token,
            user: users
        })
    } catch (error) {
        const errorDetails = {
            error: error,
            status: 500,
            message: error.message,
            errmsg: "error from signup controllers"
        }
        next(errorDetails)
    }
};

// Login Logics
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = req.body;

        // GENERATE JWT TOKEN
        const jwt_token = generateJwtToken(userData);

        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(401).send({
                message: "Invalid Credentials"
            })
        };

        const user = await User.findOne({ email });
        if (user) {
            user.image = `${req.protocol}://${req.get('host')}${user.profileImage}`;
        }

        const users = {
            name: user?.name,
            email: user?.email,
            image: user?.image,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt
        }

        // const isPassword = await bcrypt.compare(password, existUser.password);
        const isPassword = await existUser.comparePassword(password);

        if (!isPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            })
        };
        if (existUser) {
            res.status(200).json({
                status: "success",
                message: "Login Success",
                user: users,
                token: jwt_token
            })
        } else {
            res.status(500).json({
                message: "Invalid Email and Password"
            })
        }
    } catch (error) {
        const errorDetails = {
            error: error,
            status: 500,
            message: error.message,
            errmsg: "error from login controllers"
        }
        next(errorDetails);
    }
};

// Request Reset Password
exports.requestPasswordReset = async (req, res, next) => {
    const email = req.query.email;
    console.log(email)
    try {
        const user = await User.findOne({ email });
        if (!user.email) {
            return res.status(500).send({ message: 'User does not exist' })
        };

        // --- the bellow code is when you want to verify with token ----
        // const secret = process.env.JWT + user.password;
        // const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

        const resetUrl = 'http://localhost:5173/reset-page';
        console.log(user)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Email,
                pass: process.env.Password
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'AutoParts',
            subject: 'Password Reset Request',
            text: `
                You are receiving this because you have forgot your password of your account.
                Please click on the following link, or paste this into your browser to complete the process:${resetUrl}               
            `
        };
        await transporter.sendMail(mailOptions)
        res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
        const errorDetails = {
            error: error,
            status: 500,
            message: error.message,
            errmsg: "error from request password reset"
        }
        next(errorDetails);
    }
}

