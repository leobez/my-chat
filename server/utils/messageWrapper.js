/* 
    THIS FILE PROVIDES SYNCRONOUS WRAPPERS FOR SQLITE3 FUNTCIONS THAT ACT ON 'Messages' TABLE 
*/

const db = require('../db/db')

/* 
*/
function createMessage(from, to, content) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Messages (from_user, to_user, content) VALUES (?, ?, ?)', [from, to, content], function(err) {

            if (err) {
                console.error('DB Insertion failed')
                return reject({success: false, data: err.message})
            } 
            console.log('DB Insertion successful')
            const lastId = this.lastID

            db.get('SELECT * FROM Messages WHERE messageId = ?', [lastId], (err, row) => {
                if (err) {
                    console.error('DB Query failed');
                    return reject({success: false, data: err.message})
                }
                return resolve({success: true, data: row});
            })

        })
    })
}


/* 
*/
function readMessagesBetweenUsers({by, user1, user2}) {

    let query = ''
    if (by === 'users') query = 'SELECT * FROM Messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?) ORDER BY timestamp'
    if (!query.length) return;

    return new Promise((resolve, reject) => {
        return db.all(query, [user1, user2, user2, user1], (err, rows) => {
            if (err) {
                console.error('DB Query failed')
                return reject({success: false, data: err.message})
            } 
            return resolve({success: true, data: rows});
        })
    })
}


function updateMessage() {

}

function deleteMessage() {

} 

module.exports = {
    createMessage,
    readMessagesBetweenUsers,
    updateMessage,
    deleteMessage
} 