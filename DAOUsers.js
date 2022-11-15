"use strict"
const utils = require("./utils")
const DB_USER_NOT_EXISTENT_MESSAGE = "No existe el usuario"


class DAOUsers {
    constructor(pool) {
        this.pool = pool
    }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(utils.DB_CONNECTION_ERROR_MESSAGE))

            else {
                c.query("SELECT * FROM aw_tareas_usuarios WHERE email = ? AND password = ?", [email, password],
                function(e, rows) {
                    c.release()
                    if (e) callback(new Error(utils.DB_ACCESS_ERROR_MESSAGE))
                    
                    else {
                        if (rows == 0) callback(null, false)
                        else callback(null, true)
                    }
                })
            }
        })
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function(e, c) {
            if (e) callback(new Error(utils.DB_CONNECTION_ERROR_MESSAGE))

            else {
                c.query("SELECT img FROM aw_tareas_usuarios WHERE email = ?", [email],
                function(e, rows) {
                    c.release()
                    if (e) callback(new Error(utils.DB_ACCESS_ERROR_MESSAGE))
                    
                    else {
                        if (rows == 0) callback(new Error(DB_USER_NOT_EXISTENT_MESSAGE))
                        else callback(null, rows[0].img)
                    }
                })
            }
        })        
    }
}

module.exports = DAOUsers