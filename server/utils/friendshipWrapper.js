/* 
    THIS FILE PROVIDES SYNCRONOUS WRAPPERS FOR SQLITE3 FUNTCIONS THAT ACT ON 'Friendship' TABLE 
*/

const db = require('../db/db')

function createFriendship(user1, user2) {
    return new Promise((resolve, reject) => {
        return db.run('INSERT INTO Friendship (user1, user2, sent_by, accepted, wait) VALUES (?, ?, ?, ?, ?)', [user1, user2, user1, false, true], function(err) {

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

                console.log('DB Query successful')
                return resolve({success: true, data: row});
            });

        })
    })
}

function updateFriendship(accept, messageId) {
    return new Promise((resolve, reject) => {
        return db.run('UPDATE Friendship SET accepted = ?, wait = ? WHERE friendshipId = ?', [accept, false, messageId], function(err) {

            if (err) {
                console.error('DB update failed')
                return reject({success: false, data: err.message})
            }

            console.log('DB update successful') 
            const test = this.changes
            const lastId = this.lastID

            console.log('aaa: ', test)

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


module.exports = {
    createFriendship,
    updateFriendship
}