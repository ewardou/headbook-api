const { body, validationResult } = require('express-validator');
const Users = require('../models/Users');
const Posts = require('../models/Posts');
const Comments = require('../models/Comments');

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

function deleteRequestFromArray(user1, user2) {
    if (JSON.stringify(user1.requests).includes(JSON.stringify(user2._id))) {
        const index = user1.requests.indexOf(user2._id);
        user1.requests.splice(index, 1);
        return true;
    }
    return false;
}

exports.sendRequest = async (req, res, next) => {
    try {
        const user = await Users.findById(req.body.id);
        if (!deleteRequestFromArray(user, req.user)) {
            user.requests.push(req.user._id);
        }
        await user.save();
        res.status(200).json({ msg: 'Request sent', user });
    } catch (e) {
        next(e);
    }
};

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

exports.createNewPost = [
    body('content').trim().notEmpty().withMessage('Content is empty').escape(),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({
                    errors: errors.array(),
                });
            }
            const newPost = new Posts({
                content: req.body.content,
                author: req.user._id,
            });
            await newPost.save();
            return res.json(newPost);
        } catch (e) {
            next(e);
        }
    },
];

exports.likePost = async (req, res, next) => {
    try {
        const [post, user] = await Promise.all([
            Posts.findById(req.body.postID),
            Users.findById(req.user._id),
        ]);
        post.likes += 1;
        user.likes.push(post._id);
        await Promise.all([post.save(), user.save()]);
        res.json({ post, userLikes: user.likes });
    } catch (e) {
        next(e);
    }
};

exports.dislikePost = async (req, res, next) => {
    try {
        const [post, user] = await Promise.all([
            Posts.findById(req.body.postID),
            Users.findById(req.user._id),
        ]);
        post.likes -= 1;
        user.likes.splice(user.likes.indexOf(post._id), 1);
        await Promise.all([post.save(), user.save()]);
        res.json({ post, userLikes: user.likes });
    } catch (e) {
        next(e);
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        const allPosts = await Posts.find().populate('author');
        const users = [req.user._id, ...req.user.friends];
        const filteredPosts = allPosts.filter((post) =>
            JSON.stringify(users).includes(JSON.stringify(post.author._id))
        );
        res.json(filteredPosts);
    } catch (e) {
        next(e);
    }
};

exports.createComment = [
    body('content').trim().notEmpty().withMessage('Content is empty').escape(),
    async (req, res, next) => {
        try {
            const newComment = new Comments({
                author: req.user._id,
                content: req.body.content,
                post: req.params.postID,
            });
            await newComment.save();
            res.json(newComment);
        } catch (e) {
            next(e);
        }
    },
];

exports.getComments = async (req, res, next) => {
    try {
        const allComments = await Comments.find({
            post: req.params.postID,
        }).populate('author');
        res.json(allComments);
    } catch (e) {
        next(e);
    }
};

exports.getUserInformation = async (req, res, next) => {
    try {
        const [userPosts, user] = await Promise.all([
            Posts.find({ author: req.params.userID }),
            Users.findById(req.params.userID).populate('friends'),
        ]);
        res.json({ userPosts, user });
    } catch (e) {
        next(e);
    }
};
