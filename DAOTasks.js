"use strict"


const utils = require("./utils")

const DB_TASK_NOT_EXISTENT_MESSAGE = "No existe la tarea"

class DAOTasks {
    constructor(pool) {
        this.pool=pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function(e, connection){
            if(e){
                callback(utils.DB_CONNECTION_ERROR_MESSAGE)
            }
            else{
                connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?",
                [email],
                function(e, rows){
                    let idUsuario = null
                    if(e){
                        callback(utils.DB_ACCESS_ERROR_MESSAGE)
                    }
                    else{
                        if (rows.length > 0) idUsuario = rows[0].idUser
                        if(idUsuario != null) {
                            connection.query("SELECT aw_tareas_user_tareas.idTarea AS id, aw_tareas_user_tareas.hecho AS done, aw_tareas_tareas.texto AS text, aw_tareas_etiquetas.texto as tagText FROM aw_tareas_usuarios JOIN aw_tareas_user_tareas ON aw_tareas_usuarios.idUser = aw_tareas_user_tareas.idUser JOIN aw_tareas_tareas ON aw_tareas_user_tareas.idTarea = aw_tareas_tareas.idTarea JOIN aw_tareas_tareas_etiquetas ON aw_tareas_tareas.idTarea = aw_tareas_tareas_etiquetas.idTarea JOIN aw_tareas_etiquetas ON aw_tareas_tareas_etiquetas.idEtiqueta = aw_tareas_etiquetas.idEtiqueta where aw_tareas_usuarios.idUser = ?",
                            [idUsuario],
                            function(e, rows) {
                                connection.release()

                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                else {
                                    let tasksObject = rows.reduce((task, row) => {
                                        if (task[row.id] === undefined) {
                                            task[row.id] = {id: row.id, text: row.text, done: row.done, tags:[row.tagText]}
                                        }
                                        else task[row.id].tags.push(row.tagText)
                                        
                                        return task
                                    }, {})
                                    let tasks = Object.values(tasksObject)
                                    callback(null, tasks)
                                }
                            })
                        }
                        else callback(null, null)
                    }
                })
            }
        })
    }

    insertTask(email, task, callback) {
        let idTarea, idUsuario

        this.pool.getConnection(function (e, connection) {
            if (e) callback(utils.DB_CONNECTION_ERROR_MESSAGE)
            else {
                // Buscar Tarea 
                connection.query("SELECT idTarea FROM aw_tareas_tareas WHERE texto = ?",
                [task.text],
                function(e, rows) {
                    if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                    else {
                        // Tarea ya existe
                        if (rows.length !== 0) {
                            idTarea = rows[0].idTarea

                            // Buscar Usuario
                            connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?",
                            [email],
                            function(e, rows) {
                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                else {
                                    idUsuario = rows[0].idUser
                                    
                                    // Asignar Tarea y Usuario
                                    connection.query("INSERT INTO aw_tareas_user_tareas (idTarea, idUser, hecho) VALUES (?, ?, ?)",
                                    [idTarea, idUsuario, task.done],
                                    function(e, result) {
                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                        else {
                                            // Buscar Etiquetas
                                            for(var i = 0; i < task.tags.length; i++) {
                                                const tag = task.tags[i]
                                                connection.query("SELECT idEtiqueta FROM aw_tareas_etiquetas WHERE texto = ?",
                                                [task.tags[i]],
                                                function(e, rows) {
                                                    if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                    else{
                                                        // Crear Etiqueta
                                                        if (rows.length === 0){
                                                            connection.query("INSERT INTO aw_tareas_etiquetas (texto) VALUES (?)",
                                                            [tag],
                                                            function(e, result) {
                                                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                                else {
                                                                    // Asignar Etiqueta a Tarea
                                                                    connection.query("INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES (?, ?)",
                                                                    [idTarea, result.insertId],
                                                                    function(e, result) {
                                                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                                    })
                                                                }
                                                            })
                                                        }
                                                        // Etiqueta ya existe
                                                        else {
                                                            // Asignar Etiqueta a Tarea
                                                            connection.query("INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES (?, ?)",
                                                            [idTarea, rows[0].idEtiqueta],
                                                            function(e, result) {
                                                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                            connection.release()
                                            callback(null)
                                        }
                                    })
                                }
                            })
                        }
                        // Tarea no existe
                        else {
                            // Crear Tarea
                            connection.query("INSERT INTO aw_tareas_tareas (texto) values(?)",
                            [task.text],
                            function(e, result) {
                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                else {
                                    idTarea = result.insertId

                                    // Buscar Usuario
                                    connection.query("SELECT idUser FROM aw_tareas_usuarios WHERE email = ?",
                                    [email],
                                    function(e, rows) {
                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                        else {
                                            idUsuario = rows[0].idUser
                                            
                                            // Asignar Tarea y Usuario
                                            connection.query("INSERT INTO aw_tareas_user_tareas (idTarea, idUser, hecho) VALUES (?, ?, ?)",
                                            [idTarea, idUsuario, task.done],
                                            function(e, result) {
                                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                else {
                                                    // Buscar Etiquetas
                                                    for(var i = 0; i < task.tags.length; i++) {
                                                        const tag = task.tags[i]
                                                        connection.query("SELECT idEtiqueta FROM aw_tareas_etiquetas WHERE texto = ?",
                                                        [task.tags[i]],
                                                        function(e, rows) {
                                                            if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                            else{
                                                                // Crear Etiqueta
                                                                if (rows.length === 0){
                                                                    connection.query("INSERT INTO aw_tareas_etiquetas (texto) VALUES (?)",
                                                                    [tag],
                                                                    function(e, result) {
                                                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                                        else {
                                                                            // Asignar Etiqueta a Tarea
                                                                            connection.query("INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES (?, ?)",
                                                                            [idTarea, result.insertId],
                                                                            function(e, result) {
                                                                                if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                                // Etiqueta ya existe
                                                                else {
                                                                    // Asignar Etiqueta a Tarea
                                                                    connection.query("INSERT INTO aw_tareas_tareas_etiquetas (idTarea, idEtiqueta) VALUES (?, ?)",
                                                                    [idTarea, rows[0].idEtiqueta],
                                                                    function(e, result) {
                                                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    }
                                                    connection.release()
                                                    callback(null)
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        }
                    }
                })
            }
        })
    }



    markTaskDone(idTask, callback) {
        this.pool.getConnection(function(e,connection){
            if(e){
                callback(utils.DB_CONNECTION_ERROR_MESSAGE)
            }
            else{
                
                connection.query("update aw_tareas_user_tareas set hecho = 1 where idTarea= ? ",[idTask],
                function(e, rows){
                    connection.release();
                    if(e) callback(utils.DB_ACCESS_ERROR_MESSAGE);
                    else callback(null);
                });
                
            }
        });
    }

    deleteCompleted(email, callback) {
        this.pool.getConnection(function(e,connection){
            if(e){
                callback(utils.DB_CONNECTION_ERROR_MESSAGE)
            }
            else{
                let idUsuario = null
                connection.query("select idUser from aw_tareas_usuarios where email= ? ",[email],
                function(e,rows){
                    if(e){
                        callback(utils.DB_ACCESS_ERROR_MESSAGE);
                    }
                    else{
                        if (rows.length > 0) idUsuario = rows[0].idUser
                        if (idUsuario != null) {
                            connection.query("select idTarea from aw_tareas_user_tareas where hecho=1 and idUser=? ",[idUsuario],
                            function(e, rows){
                                if(e){
                                    callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                }
                                else{
                                    for(let i = 0; i < rows.length; i++){
                                        connection.query("SELECT COUNT(idTarea) as count FROM aw_tareas_user_tareas WHERE idTarea= ?", [rows[i].idTarea],
                                        async function(e, result){
                                            if(e){
                                                callback(utils.DB_ACCESS_ERROR_MESSAGE);
                                            }
                                            else {
                                                if (result[0].count > 1) { 
                                                    await connection.query("DELETE FROM aw_tareas_user_tareas WHERE idUser = ? AND idTarea = ?",
                                                    [idUsuario, rows[i].idTarea],
                                                    function(e, result) {
                                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                    })
                                                }

                                                else {
                                                    await connection.query("DELETE FROM aw_tareas_tareas WHERE idTarea = ?",
                                                    rows[i].idTarea,
                                                    function(e, result) {
                                                        if (e) callback(utils.DB_ACCESS_ERROR_MESSAGE)
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    connection.release()
                                    callback(null)
                                }
                            })
                        }    
                    }
                })
            }
        })
    }
}

module.exports = DAOTasks