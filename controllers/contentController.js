const Users = require('../models/Users');

exports.getPeople = async (req, res, next) => {
    try {
        const allUsers = await Users.find();
        const filteredArray = allUsers.filter(
            (user) => JSON.stringify(user._id) !== JSON.stringify(req.user._id)
        );
        res.json(filteredArray);
    } catch (e) {
        next(e);
    }
};

exports.sendRequest = async (req, res, next) => {
    try {
        const user = await Users.findById(req.body.id);
        if (!user.requests) {
            user.requests = [];
        }
        if (
            JSON.stringify(user.requests).includes(JSON.stringify(req.user._id))
        ) {
            const index = user.requests.indexOf(req.user._id);
            user.requests.splice(index, 1);
        } else {
            user.requests.push(req.user._id);
        }
        await user.save();
        res.status(200).json({ msg: 'Request sent', user });
    } catch (e) {
        next(e);
    }
};
