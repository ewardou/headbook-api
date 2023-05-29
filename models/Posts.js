const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: String,
    date: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

module.exports = mongoose.model('posts', postSchema);
