const db = require('../db/db')

class  UserModel {

    static create(user) {
        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [user.username, user.password], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Users WHERE userId = ?', lastId, function(err, row) {
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

        if (by === 'username') {
             query = 'SELECT * FROM Users WHERE username = ?'
             nData=[data]
        }

        if (by === 'id') {
            query = 'SELECT * FROM Users WHERE userId = ?'
            nData=[data]
        }
        
        if (by === 'all') {
            query = 'SELECT userId, socketId, username, created_at, updated_at FROM Users'
            nData=[]
        }

        if (!query) return;

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

    static update({fieldsToBeUpdated=[], newData=[], whereUserId}) {

        if (!fieldsToBeUpdated.length) return;
        if (!newData.length) return;
        if (fieldsToBeUpdated.length !== newData.length) return;
        if (!whereUserId) return;

        let checkedFields = fieldsToBeUpdated.map((field) => `${field}=?`)
        const joinedFields = checkedFields.join(', ')

        let query = `UPDATE Users SET ${joinedFields} WHERE userId = ?`
        let nData = [...newData, whereUserId]

        return new Promise((resolve, reject) => {
            return db.run(query, nData, function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }

                db.get('SELECT * FROM Users WHERE userId = ?', whereUserId, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        })
    }

    static delete(userId) {
        return new Promise((resolve, reject) => {
            return db.run('DELETE FROM Users WHERE userId = ?', [userId], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                return resolve(true)
            })
        })
    }
}

module.exports = UserModel 