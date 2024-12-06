/* SYNCRONOUS WRAPPERS FOR SQLITE3 FUNCTIONS */

const db = require('../db/db')

// Select every user to see socketId for testing (TO REMOVE)
function getSocketInfo() {
    return new Promise((resolve, reject) => {
        return db.all(`SELECT userId, socketId FROM Users`, (err, row) => {
            if (err) {
                return reject(err.message)
            }
            console.log('Data: ', row)
            return resolve(row)
        })
    })
}

// Update socketId
function updateSocketId(userId, socketId) {
    return new Promise((resolve, reject) => {
        return db.run('UPDATE Users SET socketId = ? WHERE userId = ?', [socketId, userId], (err) => {
            if (err) {
                console.error('DB update failed')
                return reject(err.message)
            } 
            return resolve('socketId updated')
        })
    })
}

// Get socketId
function getSocketIdByUserId(userId) {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT socketId FROM Users WHERE userId = ?`, [userId], (err, row) => {
            if (err) {
                return reject(err.message)
            }
            return resolve(row)
        })
    })
}

function insertUser(email, username, hash) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Users (email, username, password) VALUES (?, ?, ?)', [email, username, hash], (err) => {
            if (err) {
                console.error('DB Insertion failed')
                return reject(err.message)
            } 
            return resolve('User created')
        })
    })
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT userId, email, username, password FROM Users WHERE email = ?`, [email],  (err, row) => {
            if (err) {
                return reject(err.message)
            }
            return resolve(row)
        })
    })
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT userId, username FROM Users WHERE userId = ?`, [id],  (err, row) => {
            if (err) {
                return reject(err.message)
            }
            return resolve(row)
        })
    })
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        return db.all(`SELECT userId, username FROM Users`, (err, row) => {
            if (err) {
                return reject(err.message)
            }
            return resolve(row)
        })
    })
}

module.exports = {
    getSocketInfo,
    updateSocketId,
    getSocketIdByUserId,
    insertUser,
    getUserByEmail,
    getUserById,
    getAllUsers
}