const mongoose = require('mongoose');

const db = {
    connect: () =>
        mongoose
            .connect(process.env.MONGODB_CONNECTION, { autoIndex: false })
            .then(() => console.log('DB Connected'))
            .catch((err) => console.log(err)),
};

module.exports = db;
