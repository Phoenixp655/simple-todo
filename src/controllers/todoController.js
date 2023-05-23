const express = require('express');
const asyncHandle = require('express-async-handler');
const todoModel = require('../models/todoSchema')

// get all todos
const getAllTodo = asyncHandle( async (req, res) => {
    todoModel.find({})
    .then(data => res.status(200).json({data: data}))
})

// create todo
const createTodo = asyncHandle( async (req, res) => {
    const reqBody = req.body
    await todoModel.create({
        name: reqBody.name,
        is_done: reqBody.isDone
    })
    .then(data => res.status(200).json({data: data}))
})

// update todo
const updateTodo = asyncHandle( async (req, res) => {
    const reqBody = req.body;
    await todoModel.updateOne({
        _id: req.params.id},
        {$set: {name: reqBody.name, is_done: reqBody.isDone}
    })
    .then(data => res.status(200).json({mss: 'update todo success!'}))
})


//delete todo
const deleteTodo = asyncHandle( async (req, res) => {
    await todoModel.deleteOne({
        _id: req.params.id
    })
    .then(data => res.status(200).json({mss: 'delete todo success!'}))
})

module.exports = {
    getAllTodo,
    createTodo,
    updateTodo,
    deleteTodo
}