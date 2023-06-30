const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const ImageKit = require('imagekit');
const Users = require('../models/Users');

require('dotenv').config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

exports.createNewUser = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name field is empty')
        .escape(),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name field is empty')
        .escape(),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email field is empty')
        .isEmail()
        .withMessage('Not a valid e-mail address')
        .escape()
        .custom(async (value) => {
            const user = await Users.findOne({ email: value }).exec();
            if (user) {
                throw new Error('Email already in use');
            }
        }),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must at least have 8 characters')
        .escape(),
    body('passwordConfirm')
        .trim()
        .escape()
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords don't match"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({
                errors: errors.array(),
            });
        }

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) next(err);
            const newUser = new Users({
                password: hashedPassword,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
            return res.json({ token });
        });
    },
];

exports.login = async (req, res, next) => {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json({ msg: 'Could not find user' });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
            return next(err);
        }
        if (result) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET);
            return res.status(200).json({ token });
        }
        return res.status(401).json({ msg: 'Wrong password' });
    });
};

exports.getUploadAuth = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
};
