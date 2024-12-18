const db = require('../db/db')

class UserGroupModel {

    static create(groupId, userId, accepted, role) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Users_groups (groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)', [groupId, userId, accepted, !accepted, role], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Users_groups WHERE userGroupId = ?', lastId, function(err, row) {
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

        if (by === 'groupId') {
            query = 'SELECT * FROM Users_groups WHERE groupId = ?'
            nData = [data]
        }

        if (by === 'userId') {
            query = 'SELECT * FROM Users_groups WHERE userId = ?'
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

module.exports = UserGroupModel