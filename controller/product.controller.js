const { addProductService } = require("../service/product.service");

exports.addProduct = async (req, res, next) => {
    try {
        const product = req.body;
        const data = await addProductService(product);
        res.status(200).send({
            status: 'success',
            data
        });
    } catch (error) {
        res.status(500).send({
            status: 'failed',
            error: error.message
        });
        next(error);
    };
};