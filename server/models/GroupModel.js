const db = require('../db/db')

class GroupModel {

    static create(groupData, userId) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Groups (name, owner, description) VALUES (?, ?, ?)', [groupData.name, userId, groupData.description], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Groups WHERE groupId = ?', lastId, function(err, row) {
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

        if (by === 'count_byowner') {
            query = 'SELECT COUNT(*) AS total FROM Groups WHERE owner = ?'
            nData = [data]
        }

        if (by === 'owner') {
            query = 'SELECT * FROM Groups WHERE owner = ?'
            nData = [data]
        }

        if (by === 'groupId') {
            query = 'SELECT * FROM Groups WHERE groupId = ?'
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

module.exports = GroupModel