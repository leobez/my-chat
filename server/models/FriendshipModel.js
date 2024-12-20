const db = require('../db/db')

class  FriendshipModel {

    static create(friendshipData) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Friendship (from_user, to_user, accepted, wait) VALUES (?, ?, ?, ?)', [friendshipData.from, friendshipData.to, false, true], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Friendship WHERE friendshipId = ?', lastId, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        })

    }

    static read({by, all=false, data}) {

        let query = ''
        let nData = []

        if (by === 'sent') {
            query = 'SELECT * FROM Friendship WHERE from_user = ? ORDER BY created_at'
            nData = [data]
        }

        if (by === 'received') {
            query = 'SELECT * FROM Friendship WHERE to_user = ? ORDER BY created_at'
            nData = [data]
        }

        if (by === 'id') {
            query = 'SELECT * FROM Friendship WHERE friendshipId = ?'
            nData = [data]
        }

        if (by === 'userId') {
            query = 'SELECT * FROM Friendship WHERE ((from_user = ?) OR (to_user = ?)) AND accepted = TRUE'
            nData = [data, data]
        }

        if (by === 'all') {
            query = 'SELECT * FROM Friendship'
            nData = []
        }

        if (!query) return;

        // Get multiple lines
        if (all) {
            return new Promise((resolve, reject) => {
                return db.all(query, nData, function(err, rows) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(rows)
                })
            })
        } else {
            // Get one line
            return new Promise((resolve, reject) => {
                return db.get(query, nData, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        }

    }

    static update({friendshipId, accepted}) {

        return new Promise((resolve, reject) => {
            return db.run('UPDATE Friendship SET accepted = ?, wait = ? WHERE friendshipId = ?', 
                [accepted, false, friendshipId], function(err) {
    
                if (err) {
                    return reject({type: 'model', error: err.message})
                }

                const lastId = this.lastID
    
                db.get('SELECT * FROM Friendship WHERE friendshipId = ?', [lastId], function (err, row) {
    
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
    
                    return resolve(row);
                });
    
            })
        })
    }

    static delete(friendshipId) {
        return new Promise((resolve, reject) => {
            return db.run('DELETE FROM Friendship WHERE friendshipId = ?', 
                [friendshipId], function(err) {

                if (err) {
                    return reject({type: 'model', error: err.message})
                }

                resolve(true)
            })
        })
    }
}

module.exports = FriendshipModel 