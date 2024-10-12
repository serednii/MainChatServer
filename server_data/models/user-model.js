
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    id: { type: String },
    userName: { type: String },
    lastUserName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    isAddedContent: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    activationLink: { type: String },
    roles: {
        type: [String],
        enum: ['admin', 'editor', 'user', 'other'], // Перелічені ролі
        default: ['user'] // За замовчуванням всі користувачі мають роль 'user'
    },
});

module.exports = model('User', UserSchema);
