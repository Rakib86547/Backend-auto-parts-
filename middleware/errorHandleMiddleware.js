exports.errorHandle = (error, req, res, next) => {
    if (error) {
        const status = error.status || 500;
        const message = error.message || 'backend error';
        const errmsg = error.errmsg || 'error from backend'

        return res.status(status).send({
            status,
            message,
            errmsg
        })
    }

}