/* 
    THIS FILE PROVIDES SYNCRONOUS WRAPPERS FOR SQLITE3 FUNTCIONS THAT ACT ON 'Messages' TABLE 
*/

const db = require('../db/db')

/* 
    Creates user on database.
        if success: returns Object{success:true, data:row_that_was_added}
        if fails: returns Object{success:false, data:<err.message>}
*/
function createMessage(email, username, hash) {
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
function readMessage({by, data}) {

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


function updateMessage() {

}

function deleteMessage() {

} 


module.exports = {
    createMessage,
    readMessage,
    updateMessage,
    deleteMessage
} 