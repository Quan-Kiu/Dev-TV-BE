const validate = {
    product: (req, res, next) => {
        // Is required
        for (const key in req.body) {
            if (!req.body[key]) return next(new Error(`${key} is required`));
        }
        return next();
    },
};
module.exports = validate;
