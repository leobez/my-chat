const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const DB_PATH = path.join(__dirname, 'database.sqlite3')

// Delete existing DB file (if exists)
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('Old DB deleted')
}

//Create new DB connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error while connecting to database', err.message)
    } else {
        console.log('Connected to SQLITE3 database')
    }
})

// Default password for testing (TO REMOVE)
const salt = bcrypt.genSaltSync(12)
const hash = bcrypt.hashSync('password_test', salt)

// Run commands in order
db.serialize(() => {

    // Create tables
    // Table 'Users'
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
            console.log('Error while creating "Users" table', err.message)
        } else {
            console.log('Table Users created')
        }
    }),

    // Table 'Friendship'
    db.run(`
        CREATE TABLE Friendship(
            friendshipId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            user1 INTEGER NOT NULL,
            user2 INTEGER NOT NULL,
            sent_by INTEGER NOT NULL,
            accepted BOOLEAN,
            wait BOOLEAN,
            FOREIGN KEY(user1) REFERENCES Users(userId),
            FOREIGN KEY(user2) REFERENCES Users(userId)
        ); 
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" table', err.message)
        } else {
            console.log('Table Friendship created')
        }
    }),

    // Table 'Messages'
    db.run(`
        CREATE TABLE Messages(
            messageId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_user INTEGER NOT NULL,
            content VARCHAR(500) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(from_user) REFERENCES Users(userId),
            FOREIGN KEY(to_user) REFERENCES Users(userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Messages" table', err.message)
        } else {
            console.log('Table Messages created')
        }
    }),


    // Insert some data for testing (Users) (TO REMOVE)
    /* 
        email_test@email.com    password_test     
        email_test2@email.com   password_test
        email_test3@email.com   password_test
    */
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

    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['email_test3@email.com', 'username_test3', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    
    // Insert some data for testing (Messages) (TO REMOVE)
    db.run(`
        
        INSERT INTO Messages(from_user, to_user, content) VALUES (?, ?, ?)

    `, [1, 2, 'Eae mano user2, de boa?'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    db.run(`
        
        INSERT INTO Messages(from_user, to_user, content) VALUES (?, ?, ?)

    `, [2, 1, 'de boa man user1, e você?'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    })

})

module.exports = db 