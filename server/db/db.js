const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')

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

const salt = bcrypt.genSaltSync(12)
const hash = bcrypt.hashSync('password_test', salt)

db.serialize(() => {

    // Create tables
    db.run(`
        CREATE TABLE Users(
            userId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            socketId VARCHAR(255) UNIQUE, 
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating DB file: ', err.message)
        } else {
            console.log('Table Users created')
        }
    }),

    db.run(`
        CREATE TABLE Friendship(
            friendshipId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            user1 INTEGER NOT NULL,
            user2 INTEGER NOT NULL,
            FOREIGN KEY(user1) REFERENCES Users(userId),
            FOREIGN KEY(user2) REFERENCES Users(userId)
        ); 
    `, (err) => {
        if (err) {
            console.log('Error while creating friendship table: ', err.message)
        } else {
            console.log('Table Friendship created')
        }
    }),
    
    db.run(`
        CREATE TABLE Messages(
            messageId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_user INTEGER NOT NULL,
            content VARCHAR(500) NOT NULL,
            FOREIGN KEY(from_user) REFERENCES Users(userId),
            FOREIGN KEY(to_user) REFERENCES Users(userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating messages table: ', err.message)
        } else {
            console.log('Table Messages created')
        }
    }),

    // Insert some data for testing
    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['email_test@email.com', 'username_test', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['email_test2@email.com', 'username_test2', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    // View if data was inserted correctly
    db.all(`SELECT * FROM Users`, (err, row) => {
        if (err) {
            return console.log('Error while selecting from Users on DB: ', err)
        }

        return console.log('Current state of DB: ', row)
    })
})


module.exports = db 