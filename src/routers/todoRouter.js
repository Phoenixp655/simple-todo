const router = require('express').Router();
const {getAllTodo, createTodo, updateTodo, deleteTodo} = require('../controllers/todoController')

// todo router
router.route('/todos')
.get((req, res) => {
    getAllTodo(req, res);
})
.post((req, res) => {
    createTodo(req, res)
})
router.route('/todos/:id')
.put((req, res) =>{
    updateTodo(req, res)
})
.delete((req, res) => {
    deleteTodo(req, res)
})

module.exports = router