const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const DB_PATH = path.join(__dirname, 'database.sqlite3')

// Delete existing DB file (if exists)
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Old DB deleted.')
}

//Create new DB connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error while connecting to database', err.message)
    } else {
        console.log('Connected to SQLITE3 database')
    }
})

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE Users(
            userId INTEGER AUTO_INCREMENT NOT NULL,
            socketId VARCHAR(255) UNIQUE, 
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,

            PRIMARY KEY(userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating DB file: ', err.message)
        } else {
            console.log('Table Users created')
        }
    })
})

db.run(`
    CREATE TABLE Friendship(
        friendshipId INTEGER AUTO_INCREMENT NOT NULL,
        user1 INTEGER NOT NULL,
        user2 INTEGER NOT NULL,

        PRIMARY KEY(friendshipId),
        FOREIGN KEY(user1) REFERENCES Users(userId),
        FOREIGN KEY(user2) REFERENCES Users(userId)
    ); 
`, (err) => {
    if (err) {
        console.log('Error while creating friendship table: ', err.message)
    } else {
        console.log('Table Friendship created')
    }
})

db.run(`
    CREATE TABLE Messages(
        messageId INTEGER AUTO_INCREMENT NOT NULL,
        from_user INTEGER NOT NULL UNIQUE,
        to_user INTEGER NOT NULL UNIQUE,
        content VARCHAR(500) NOT NULL,

        PRIMARY KEY(messageId),
        FOREIGN KEY(from_user) REFERENCES Users(userId),
        FOREIGN KEY(to_user) REFERENCES Users(userId)
    )
`, (err) => {
    if (err) {
        console.log('Error while creating messages table: ', err.message)
    } else {
        console.log('Table Messages created')
    }
})


module.exports = db 