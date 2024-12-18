const db = require('../db/db')

class MembershipModel {

    static create(groupId, userId, accepted, role) {

        return new Promise((resolve, reject) => {
            return db.run('INSERT INTO Membership (groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)', [groupId, userId, accepted, !accepted, role], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                const lastId = this.lastID

                db.get('SELECT * FROM Membership WHERE membershipId = ?', lastId, function(err, row) {
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
            query = 'SELECT * FROM Membership WHERE groupId = ?'
            nData = [data]
        }

        if (by === 'userId') {
            query = 'SELECT * FROM Membership WHERE userId = ?'
            nData = [data]
        }

        if (by === 'membershipId') {
            query = 'SELECT * FROM Membership WHERE membershipId = ?'
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

    static update(membershipId, accepted) {
        return new Promise((resolve, reject) => {
            return db.run('UPDATE Membership SET accepted = ?, wait = ? WHERE membershipId = ?', [accepted, false, membershipId], function(err) {
                
                if (err) {
                    return reject({type: 'model', error: err.message})
                }

                db.get('SELECT * FROM Membership WHERE membershipId = ?', membershipId, function(err, row) {
                    if (err) {
                        return reject({type: 'model', error: err.message})
                    }
                    return resolve(row)
                })
            })
        })
    }

    static delete(membershipId) {
        return new Promise((resolve, reject) => {
            return db.run('DELETE FROM Membership WHERE membershipId = ?', [membershipId], function(err) {
                if (err) {
                    return reject({type: 'model', error: err.message})
                }
                return resolve(true)
            })
        })
    }

}

module.exports = MembershipModel