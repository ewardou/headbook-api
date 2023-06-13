const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePicture: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 8 },
    friends: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'users' }],
});

module.exports = mongoose.model('users', userSchema);
