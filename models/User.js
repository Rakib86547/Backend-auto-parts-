const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name'],
        trim: true,
        minLength: [3, 'your name is too short'],
        mixLength: [100, 'your name to long']
    },
    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'email is not valid'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isStrongPassword(value, {
                    minLength: 6,
                    minUppercase: 1,
                    minLowercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })
            },
            message: (props) => `password ${props.value} is not strong enough. password must be 6 character, at least 1 uppercase, 1 lowercase, 1 number, 1 symbols`
        },
    },
    // confirmPassword: {
    //     type: String,
    //     required: [true, 'enter your confirm password'],
    //     validate: {
    //         validator: function (value) {
    //             console.log('confirm password value', value)
    //             console.log('this password', this.password)                
    //             return value === this.password
    //         },
    //         message: 'password did not match'
    //     }
    // },
    // image: {
    //     type: String,
    //     required: [true, 'please insert image'],
    //     validate: [validator.isURL, 'image is not valid']
    // }
    image: {type: String}
}, {
    timestamps: true
});


// secure the password with bcrypt hash
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash
    } catch (error) {
        next(error)
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema);
module.exports = User