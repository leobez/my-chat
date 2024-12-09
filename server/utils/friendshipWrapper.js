/* 
    THIS FILE PROVIDES SYNCRONOUS WRAPPERS FOR SQLITE3 FUNTCIONS THAT ACT ON 'Friendship' TABLE 
*/

const db = require('../db/db')

function createFriendship(from, to) {

    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Friendship (from_user, to_user, accepted, wait) VALUES (?, ?, ?, ?)', [from, to, false, true], function(err) {

            if (err) {
                console.error('DB Insertion failed')
                return reject({success: false, data: err.message})
            }

            console.log('DB Insertion successful') 
            const lastId = this.lastID

            db.get('SELECT * FROM Friendship WHERE friendshipId = ?', [lastId], function (err, row) {

                if (err) {
                    console.error('DB Query failed');
                    return reject({success: false, data: err.message});
                }

                console.log('DB Query successful: ', row)
                return resolve({success: true, data: row});
            });

        })
    })
}

function readFriendship({by, data}) {
    
    let query = ''
    if (by === 'byid') query = 'SELECT * FROM Friendship WHERE friendshipId = ?'
    if (by === 'from_user') query = 'SELECT * FROM Friendship WHERE from_user = ?'
    if (by === 'to_user') query = 'SELECT * FROM Friendship WHERE to_user = ?'
    if (!query.length) return;

    if (by === 'from_user' || by === 'to_user') {
        return new Promise((resolve, reject) => {

            return db.all(query, [data], function(err, rows) {
    
                if (err) {
                    console.error('DB query failed')
                    return reject({success: false, data: err.message})
                }
    
                console.log('DB query successful') 
                //console.log('rows: ', rows)
                return resolve({success: true, data: rows})
    
            })
        })
    }

    return new Promise((resolve, reject) => {

        return db.get(query, [data], function(err, row) {

            if (err) {
                console.error('DB query failed')
                return reject({success: false, data: err.message})
            }

            console.log('DB query successful') 
            //console.log('row: ', row)
            return resolve({success: true, data: row})

        })
    })
}

function updateFriendship(accept, friendshipId) {

    return new Promise((resolve, reject) => {
        return db.run('UPDATE Friendship SET accepted = ?, wait = ? WHERE friendshipId = ?', [accept, false, friendshipId], function(err) {

            if (err) {
                console.error('DB update failed')
                return reject({success: false, data: err.message})
            }

            console.log('DB update successful') 
            const lastId = this.lastID

            db.get('SELECT * FROM Friendship WHERE friendshipId = ?', [lastId], function (err, row) {

                if (err) {
                    console.error('DB Query failed');
                    return reject({success: false, data: err.message});
                }

                console.log('DB Query successful: ', row)
                return resolve({success: true, data: row});
            });

        })
    })
}

function deleteFriendship(friendshipId) {

}

module.exports = {
    createFriendship,
    updateFriendship,
    readFriendship,
    deleteFriendship
}