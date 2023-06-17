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
        if (!deleteRequestFromArray(user, req.user)) {
            user.requests.push(req.user._id);
        }
        await user.save();
        res.status(200).json({ msg: 'Request sent', user });
    } catch (e) {
        next(e);
    }
};

function deleteRequestFromArray(user1, user2) {
    if (JSON.stringify(user1.requests).includes(JSON.stringify(user2._id))) {
        const index = user1.requests.indexOf(user2._id);
        user1.requests.splice(index, 1);
        return true;
    }
    return false;
}

exports.acceptFriendRequest = async (req, res, next) => {
    try {
        const [user1, user2] = await Promise.all([
            Users.findById(req.user._id),
            Users.findById(req.body.id),
        ]);
        user1.friends.push(user2._id);
        user2.friends.push(user1._id);
        deleteRequestFromArray(user1, user2);
        deleteRequestFromArray(user2, user1);
        await Promise.all([user1.save(), user2.save()]);
        res.json({ user1, user2 });
    } catch (e) {
        next(e);
    }
};

exports.declineFriendRequest = async (req, res, next) => {
    try {
        const [user1, user2] = await Promise.all([
            Users.findById(req.user._id),
            Users.findById(req.body.id),
        ]);
        deleteRequestFromArray(user1, user2);
        deleteRequestFromArray(user2, user1);
        await Promise.all([user1.save(), user2.save()]);
        res.json('Request declined');
    } catch (e) {
        next(e);
    }
};

exports.getMyInformation = async (req, res) => {
    res.json(req.user);
};
