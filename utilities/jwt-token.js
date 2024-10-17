const jwt = require('jsonwebtoken');

exports.generateJwtToken = (userData) => {
    const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, { expiresIn: '7days' });
    return token;
};