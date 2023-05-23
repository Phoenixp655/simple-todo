const mongoose = require('mongoose');
const schema = mongoose.Schema;


const todoSchema = new schema ({
    item : String,
    isCompleted: {type: Boolean, default: 0},
});

module.exports = mongoose.model('Todo', todoSchema)