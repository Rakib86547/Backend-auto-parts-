const express = require('express');
const app = express();
const cors = require('cors');

//Middlewares
app.use(express.json());
app.use(cors());

// ---------------- 
const productRoute = require('./route/v1/product.route');

app.get('/', (req, res) => { res.send('api is running') });
app.use('/v1/product', productRoute);



module.exports = app;