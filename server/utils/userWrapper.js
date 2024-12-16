
const db = require('../db/db')

/* REFACTOR THESE STILL */
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

module.exports = {
    getSocketInfo,
    updateSocketId,
    getSocketIdByUserId
} 