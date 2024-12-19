const db = require('../db/db')

class  MessageModel {

    static create(message) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Messages (from_user, to_user, content) VALUES (?, ?, ?)', [message.from, message.to, message.content], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Messages WHERE messageId = ?', lastId, function(err, row) {
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

        if (by === 'history') {
            query = 'SELECT * FROM Messages WHERE (from_user = ? AND to_user = ?) OR (from_user = ? AND to_user = ?) ORDER BY created_at'
            nData = [data.user1, data.user2, data.user2, data.user1]
        }

        if (by === 'id') {
            query = 'SELECT * FROM Messages WHERE messageId = ?'
            nData = [data]
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

    static update() {
        /* ... */
    }

    static delete() {
        /* ... */
    }
}

module.exports = MessageModel 