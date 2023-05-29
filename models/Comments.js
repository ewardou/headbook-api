const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'posts' },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
});

module.exports = mongoose.model('comments', commentSchema);
