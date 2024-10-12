// module.exports = mongoose.model('Link', linkSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menu: Schema.Types.Mixed,
    idUser: String,
    // type: String,
    // level: Number,
    // nameMenu: String,
    // menu: [{ type: Schema.Types.ObjectId, ref: 'Link' }], // Самопосилання для масиву посилань
    // idLinks: [{ type: Schema.Types.ObjectId, ref: 'LinkItem' }]
}, { collection: 'menu' });

module.exports = mongoose.model('Menu', menuSchema);
