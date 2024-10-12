const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true },
});

module.exports = model('Token', TokenSchema);
