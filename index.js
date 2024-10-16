const express = require('express');
const app = express();
const cors = require('cors');

//Middlewares
app.use(express.json());
app.use(cors());

// ---------------- 
const productRoute = require('./route/v1/product.route');
const userRoute = require('./route/v1/users.route');

app.get('/', (req, res) => { res.send('Hurrah! Api is running from Backend File') });
app.use('/v1/user', userRoute);
app.use('/v1/product', productRoute);



module.exports = app;