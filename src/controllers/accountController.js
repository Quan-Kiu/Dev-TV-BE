const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const accountController = {
    
    getUsers: async (req, res, next) => {
        try {
            const users = await Account.find();
            return res.json({
                success: true,
                message: 'Get users successfully',
                users,
            });
        } catch (error) {}
    },
    verifyEmail: async(req,res,next)=>{
        try {

           n
        } catch (error) {
            next(error);
        }
    },
    store: async(req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email) {
                const err = new Error('Email is required');
                return next(err);
            }
            if (!password) {
                const err = new Error('Password is required');
                return next(err);
            }

            const account = await Account.findOne({ email: email});

            if (account) {
                const err = new Error('Email or password is exist');
                return next(err);
            }


            const randomCode = (Math.random() + 1).toString(36).substring(7);

            let transporter = nodemailer.createTransport({
                host: mailHost,
    port: mailPort,
    secure: false, 
    auth: {
      user: adminEmail,
      pass: adminPassword
    },
              });
            
              // send mail with defined transport object
              await transporter.sendMail({
                from: adminEmail, // sender address
                to: `${email}`, // list of receivers
                subject: "Hello! Please confirm your email address.", // Subject line
                text: `Hello ${email}!`,

                // HTML body
                html: `<p><img src="https://i.ibb.co/Fwp7NJr/dev-tv.png" alt="dev-tv" /></p>
                <p>Hi....</p>
                <p>Welcome to Dev-TV</p>
                <p>Please click the button below to confirm your email.</p>
                <a style="padding:10px 20px;background-color:#ea1e30;text-decoration:none;color:#fffffe;border-radius:5px;display:inline-block;max-width:70%;font-size:16px;margin:10px 0" href="http://devtv.com/auth/verify/${randomCode}">Confirm my email</a>
                <p>Thank you! See you soon on Dev-TV.</p>`
              });

            const user = new Account(req.body);
            user.save();
            return res.status(201).json({
                success: true,
                message: 'Account created successfully',
                user,
            });

        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        const { email, password } = req.body;

        if (!email) {
            const err = new Error('Email is required');
            return next(err);
        }

        try {
            const acc = await Account.findOne({ email });

            if (!acc) {
                const err = new Error('Email or password is invalid');
                return next(err);
            }

            const isValid = await bcrypt.compare(password, acc.password);

            if (!isValid) {
                const err = new Error('Email or password is invalid');
                return next(err);
            }

            const accessToken = createAccessToken({ id: acc._id });
            const refreshToken = createRefreshToken({ id: acc._id });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                success: true,
                message: 'Login successfully',
                token: accessToken,
                user: {
                    ...acc._doc,
                    password: '',
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

const createRefreshToken = (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '15d',
    });

module.exports = accountController;
