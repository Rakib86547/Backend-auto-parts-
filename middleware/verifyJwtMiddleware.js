const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.verifyJwtToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({
                status: "failed",
                message: "Unauthorized access"
            });
        };
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decoded) {
            if (error) {
                return res.status(401).send({
                    status: "Failed",
                    message: "forbidden access"
                });
            };
            req.decoded = decoded
            next();
        })
    } catch (error) {
        res.status(400).send({
            status: 'failed',
            message: error.message
        });
        next(error)
    };
};