const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const db = require('./configs/db');
const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

// Connect DB

db.connect();

// Middlewares
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use('/api', routes);

// Catch 404 errors

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Handle errors

app.use((err, req, res, next) => {
    const error = err ?? {};

    const status = error.status || 500;

    // if (error instanceof mongoose.Document.ValidationError) {
    //     error.message = error.errors[Object.keys(error.errors)[0]].message;
    // }

    return res.status(status).json({ success: false, message: error.message });
});

// Start the server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
