const User = require("../models/User");
const { signUpService, existUserService } = require("../service/users.service");
const bcrypt = require('bcryptjs');


// Register Logic
exports.signUp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const userData = req.body;
        const userInfo = {
            name: userData?.name,
            email: userData?.email,
            password: userData?.password,
            image: userData?.image
        };

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).send({ message: 'email already exist' })
        }

        const userCreated = await User.create(userInfo)
        res.status(200).send({
            status: 'success',
            data: userCreated
        })
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            error: error.message
        });
        next(error)
    }
};

// Login Logics
exports.login = async (req, res, next) => {
    try {
        const { name, email, password, image } = req.body;
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(401).send({
                message: "Invalid Credentials"
            })
        };
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
                data: existUser
            })
        } else {
            res.status(500).json({
                message: "Invalid Email and Password"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
        next(error)
    }
}