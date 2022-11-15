"use strict"

const { json } = require("body-parser")
const { Router, request } = require("express")
const express = require("express")
const mysql = require("mysql")
const utils = require("../utils")
const config = require("./../config")
const DAOTasks = require("./../DAOTasks")

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoTasks = new DAOTasks(pool);

const taskRouter = express.Router()

// Listado de Tareas
taskRouter.get("/", utils.isUserAuthenticated, (req, res) => {
    daoTasks.getAllTasks(req.session.currentUser, function(err, tasks) {
        if(err) res.status(500).json(err)
        else res.status(200).render("tasks", {taskList: tasks})
    })
})

// Añadir Tareas
taskRouter.get("/addTask", (req, res) => {
    res.render("addTask", {errorMessage: null})
})
taskRouter.post("/addTask", utils.isUserAuthenticated, async (req, res) => {
    let newTask
    try {
        newTask = await utils.createTask(req.body.task)
        daoTasks.insertTask(req.session.currentUser, newTask, (err) => {
            if (err) res.status(500).json(err)
            else res.status(200).redirect("/tasks")
        })
    } catch (error) {
        res.status(300).render("addTask", {errorMessage: error.message})
    }
})

// Finalizar Tarea
taskRouter.get("/finish/:taskId", utils.isUserAuthenticated, (req, res) => {
    daoTasks.markTaskDone(req.params.taskId, function(err) {
        if (err) res.status(500).json(err)
        else res.status(200).redirect("/tasks")
    })
})

// Eliminar Tareas finalizadas
taskRouter.get("/deleteCompleted", utils.isUserAuthenticated, (req, res) => {
    daoTasks.deleteCompleted(req.session.currentUser, function(err) {
        if (err) res.status(500).json(err)
        else res.status(200).redirect("/tasks")
    })
})

module.exports = taskRouter