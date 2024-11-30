const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./Database.db', (err) => {
    if (err) {
        console.error('Error while connecting to database', err.message)
    } else {
        console.log('Connected to SQLITE3 database')
    }
})

module.exports = db