//* FUNCIONES

/**
 * @param {String} text 
 * @returns {Object} with name (String) and tags (Array of Strings)
 */
function createTask(newTask) {
    if (!newTask) throw new Error("Tarea vacía.");
    let array = newTask.split(" ");

    let text = array.filter(word => !word.startsWith("@")).join(" ");
    if (!text) throw new Error("La tarea debe tener un nombre.");

    let tags = array.filter(word => word.startsWith("@")).map(tag => tag.replace("@", ""));
    if (tags.length === 0) throw new Error("Añada una etiqueta a la tarea.")

    return {text, tags, done: 0};
}

/**
 * @param {Array[Object]} tasks  
 * @returns {Number} number of task completed
 */
function countDone(tasks) {
    if (!tasks) throw new Error("No tasks given");
    return tasks.filter(task => task.done === true).length;
}

/**
 * @param {Array[Object]} tasks 
 * @param {Array[String]} tagsArray 
 * @returns {Array[Object]} tasks that contain at least one of the tags in tagsArray
 */
function findByTags(tasks, tagsArray){
    if (!tasks) throw new Error("No tasks given");
    return tasks.filter(task => task.tags.some(tag => tagsArray.includes(tag)));
}

function getToDoTasks(tasks){
    if (!tasks) throw new Error("No tasks given");
    let b= tasks.filter(e => e.done==undefined || e.done==false || e.done==null);
    return b.map(e => e.text );
}


function findByTag(tasks,tag){
    if(!tag && !tasks)throw new Error("No tasks nor tag given");
    if (!tasks) throw new Error("No tasks given");
    if (!tag) throw new Error("No tag given");
    return tasks.filter(task => task.tags.some(t => tag.includes(t)));
}

function isUserAuthenticated(req, res, next) {
    if (!req.session.currentUser) res.redirect("/login")
    else {
        res.locals.userEmail = req.session.currentUser
        next()
    }
}

module.exports = {createTask, countDone, findByTag, findByTags, getToDoTasks, isUserAuthenticated,
    DB_CONNECTION_ERROR_MESSAGE: "Error en la conexion a la Base de Datos",
    DB_ACCESS_ERROR_MESSAGE: "Error en el acceso a la Base de Datos"
}