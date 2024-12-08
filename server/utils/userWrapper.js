/* 
    THIS FILE PROVIDES SYNCRONOUS WRAPPERS FOR SQLITE3 FUNTCIONS THAT ACT ON 'Users' TABLE 
*/

const db = require('../db/db')

/* 
    Creates user on database.
        if success: returns Object{success:true, data:row_that_was_added}
        if fails: returns Object{success:false, data:<err.message>}
*/
function createUser(email, username, hash) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Users (email, username, password) VALUES (?, ?, ?)', [email, username, hash], function (err) {
            
            if (err) {
                console.error('DB Insertion failed')
                return reject({success: false, data: err.message})
            } 
            console.log('DB Insertion successful')
            const lastId = this.lastID

            db.get('SELECT * FROM Users WHERE userId = ?', [lastId], function (err, row) {

                if (err) {
                    console.error('DB Query failed');
                    return reject({success: false, data: err.message});
                }
                console.log('DB Query successful')
                return resolve({success: true, data: row});
            });
        })
    })
}


/* 
    Retrieves data about user from database. It can be by: email, username or userId (All UNIQUE constraints)
        if success: returns Object{success:true, data:row_that_was_added}
        if fails: returns Object{success:false, data:<err.message>}
*/
function readUser({by, data}) {

    let query = ''
    if (by === 'email') query = 'SELECT * FROM Users WHERE email = ?'
    if (by === 'username') query = 'SELECT * FROM Users WHERE username = ?'
    if (by === 'userId') query = 'SELECT * FROM Users WHERE userId = ?'
    if (!query.length) return;

    return new Promise((resolve, reject) => {
        return db.get(query, [data],  (err, row) => {
            if (err) {
                console.error('DB Insertion failed')
                return reject({success: false, data: err.message})
            }
            console.log('DB Insertion successful')
            return resolve({success: true, data: row})
        })
    })
}


function updateUser() {

}

function deleteUser() {

} 


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
    createUser,
    readUser,
    updateUser,
    deleteUser,
    getSocketInfo,
    updateSocketId,
    getSocketIdByUserId
} 