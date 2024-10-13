const Product = require("../models/Product")

exports.addProductService = async (product) => {
    const data = await Product.create(product);
    console.log(data)
    return data;
};