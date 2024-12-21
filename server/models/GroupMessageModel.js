const db = require('../db/db')

class  GroupMessageModel {

    static create(groupMessage) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO GroupMessages (from_user, to_group, content) VALUES (?, ?, ?)', [groupMessage.from_user, groupMessage.to_group, groupMessage.content], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM GroupMessages WHERE groupMessageId = ?', lastId, function(err, row) {
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
            query = 'SELECT * FROM GroupMessages WHERE to_group = ? ORDER BY created_at'
            nData = [data]
        }

        if (by === 'id') {
            query = 'SELECT * FROM GroupMessages WHERE groupMessageId = ?'
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

module.exports = GroupMessageModel 