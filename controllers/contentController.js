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
