/* SYNCRONOUS WRAPPERS FOR SQLITE3 METHODS */

const db = require('../db/db')


function insertFriendship(user1, user2, sent_by) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Friendship (user1, user2, sent_by, accepted, wait) VALUES (?, ?, ?, ?, ?)', [user1, user2, sent_by, false, true], (err) => {
            if (err) {
                console.error('DB Insertion failed')
                return reject(err.message)
            } 
            console.log(this.id)
            return resolve(true)
        })
    })
}

module.exports = {
    insertFriendship
}