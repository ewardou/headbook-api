const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const Users = require('../models/Users');

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
            return res.json(newUser);
        });
    },
];