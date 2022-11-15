"use strict"

const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers")
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session")
const mySQLSession = require("express-mysql-session")
const mySQLStore = mySQLSession(session)
const sessionStore = new mySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "practica_voluntaria"
})
const middlewareSession = session({
    saveUninitialized: false,
    secret: "secreto",
    resave: false,
    store: sessionStore
})

// Crear un servidor Express.js
const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(middlewareSession)
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")


// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOUsers
const daoUsers = new DAOUsers(pool);


// Arrancar el servidor
app.listen(config.port, function(err) {
    if (err) console.log("ERROR al iniciar el servidor");
    else console.log(`Servidor arrancado en el puerto ${config.port}`);
});

// Rutas
const taskRouter = require("./routers/taskRouter")
app.use("/tasks", taskRouter)

const userRouter = require("./routers/userRouter")
app.use("/users", userRouter)

// /tasks actúa como nuestra /
app.get("/", (req, res) => {
    res.redirect("/tasks")
})

// Inicio de sesión
app
.get("/login", (req, res) => {
    if (req.session.currentUser) res.redirect("/tasks")
    else res.status(200).render("login", {errorMessage: null})
})
.post("/login", (req, res) => {
    daoUsers.isUserCorrect(req.body.email, req.body.password, function(err, isCorrect) {
        if (err) res.status(500).json(err)
        else{
            if (isCorrect) {
                req.session.currentUser = req.body.email
                res.redirect("/tasks")
            }
            else res.status(200).render("login", {errorMessage: "Dirección de correo y/o contraseña no válidos."})
        }
    })
}) 

// Cierre de sesión
app.get("/logout", (req, res) => {
    req.session.destroy()
    res.status(200).redirect("/login")
})
