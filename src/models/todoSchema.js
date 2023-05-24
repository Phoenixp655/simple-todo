const mongoose = require('mongoose');
const schema = mongoose.Schema;


const todoSchema = new schema ({
    item : String,
    isCompleted: {type: Boolean, default: 0},
    guestSession: String,
    createdAt: { type: Date, expires: 10, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema)