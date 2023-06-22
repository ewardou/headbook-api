const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
    content: { type: String, required: true },
    image: String,
    likes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

module.exports = mongoose.model('posts', postSchema);
