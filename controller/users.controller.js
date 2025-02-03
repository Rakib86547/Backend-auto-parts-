const User = require("../models/User");
const nodemailer = require("nodemailer");
const { signUpService, existUserService } = require("../service/users.service");
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
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
    try {
        const user = await User.findOne({ email });
        if (!user.email) {
            return res.status(500).send({ message: 'User does not exist' })
        };

        // --- the bellow code is when you want to verify with token ----
        // const secret = process.env.JWT + user.password;
        // const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hashedToken
        user.resetPasswordExpire = Date.now() + 5 * 60 * 1000 //expire in 5 minutes
        // console.log("Before Saving:", user);
        // console.log("New Expiry Time:", user.resetPasswordExpire)
        await user.save();
        const resetUrl = `http://localhost:5173/reset-page?token=${resetToken}&email=${email}`;

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
            subject: 'Reset Your Password',
            text:
                `
            Hello ${user.name},

            We received a request to reset your password for your account associated with this email address. If you initiated this request, click the button below to reset your password:
            ${resetUrl}
            
            If you did not request this change, please ignore this message. Your account will remain secure, and no changes will be made
            
            Thank you,
            AutoParts`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.log("Nodemailer Error =", error)
            } else {
                res.status(200).json({
                    status: 'success',
                    message: info.response,
                    message2: 'Password Reset Email Sent. Check You Email'
                })
            }

        })
        // res.status(200).json({ message: info.response });
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

exports.passwordReset = async (req, res, next) => {
    const { email, token, newPassword } = req.body;
    // console.log(req.body)
    try {
        const user = await User.findOne({ email });
        console.log('reset password', user)
        if (!user || !user?.resetPasswordToken) {
            return res.status(500).send({ status: 'failed', message: 'Invalid or Expire Token' })
        };
        // Verify Token or Expire
        const isValidToken = await bcrypt.compare(token, user?.resetPasswordToken);
        const isTokenExpired = new Date(user?.resetPasswordExpire) < new Date()

        // console.log("User Expiry Time:", user?.resetPasswordExpire);
        // console.log("Current Time:", new Date());
        // console.log("Is Token Expired:", isTokenExpired);

        if (!isValidToken || isTokenExpired) {
            return res.status(500).send({ status: 'failed', message: 'Expire Token' })
        }
        // user.password = await bcrypt.hash(newPassword, 10); it work when i does not use pre('save') middleware in user models
        user.password = newPassword
        // Clear Reset Fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        console.log('before saving password is =', user.password)
        console.log('before saving =', user)
        await user.save()
        console.log('after saving password is =', user.password)
        res.status(200).send({
            status: 'success',
            message: 'Password Reset Successfully'
        })
    } catch (error) {
        const errorDetails = {
            error: error,
            status: 500,
            message: error.message,
            errmsg: "error from reset password controllers"
        }
        next(errorDetails);
    }
}

