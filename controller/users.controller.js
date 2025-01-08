const User = require("../models/User");
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
        const { name, email, password, image } = req.body;
        const userData = req.body;

        // GENERATE JWT TOKEN
        const jwt_token = generateJwtToken(userData);

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
}

// // Backend: Use 'multer' middleware if you're handling file uploads
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// // Assuming 'file' is the key you're using for file input in frontend
// app.post('/user/signup', upload.single('file'), async (req, res) => {
//     const { name, email, password, confirmPassword } = req.body;
//     const image = req.file;  // The uploaded file

//     // Ensure you're handling the file correctly, for example, saving the image path to the DB
// });
