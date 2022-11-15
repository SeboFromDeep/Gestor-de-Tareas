"use strict"

const { json } = require("body-parser")
const { Router, request, application } = require("express")
const express = require("express")
const mysql = require("mysql")
const utils = require("../utils")
const config = require("./../config")
const DAOUsers = require("./../DAOUsers")

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoUsers = new DAOUsers(pool);

const userRouter = express.Router()

// Buscar imagen de Usuario
userRouter.get("/userImage", utils.isUserAuthenticated, (req, res) => {
    daoUsers.getUserImageName(req.session.currentUser, function(err, image) {
        if (err) res.status(500).json(err)
        else {
            if (image === null) image = "noUser.png"
            
            res.sendFile(image, {root: "./public/img/"})
        }
    })
})

module.exports = userRouter