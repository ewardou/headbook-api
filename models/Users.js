const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: {
        type: String,
        default:
            'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg',
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 8 },
    friends: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'users' }],
});

module.exports = mongoose.model('users', userSchema);
