const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    age: String
},
    {
        timestamps: true
    });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;