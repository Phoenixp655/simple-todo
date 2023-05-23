const mongoose = require('mongoose');
const schema = mongoose.Schema;


const todoSchema = new schema ({
    name : String,
    is_done: Boolean,
});

module.exports = mongoose.model('Todo', todoSchema)