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
const hash = bcrypt.hashSync('123', salt)

// Run commands in order
db.serialize(() => {

    // Enable 'ON DELETE CASCADE'
    db.run("PRAGMA foreign_keys = ON"),

    // Create tables
    // Table 'Users'
    db.run(`
        CREATE TABLE Users(
            userId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            socketId VARCHAR(255) UNIQUE, 
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Users" table', err.message)
        } else {
            console.log('------')
            console.log('Table Users created')
        }
    }),

    // Table 'Friendship'
    db.run(`
        CREATE TABLE Friendship(
            friendshipId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_user INTEGER NOT NULL,
            accepted BOOLEAN,
            wait BOOLEAN,
            lesser_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN from_user < to_user THEN from_user ELSE to_user END),
            bigger_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN from_user < to_user THEN to_user ELSE from_user END),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lesser_id, bigger_id),
            FOREIGN KEY(from_user) REFERENCES Users(userId),
            FOREIGN KEY(to_user) REFERENCES Users(userId)
        ); 
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" table', err.message)
        } else {
            console.log('Table Friendship created')
        }
    }),

    // Table 'Messages' (Private messages)
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

    // Table 'Groups'
    db.run(`
        CREATE TABLE Groups(
            groupId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            owner INTEGER NOT NULL,
            description VARCHAR(200) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(owner) REFERENCES Users(userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Groups" table', err.message)
        } else {
            console.log('Table Groups created')
        }
    }),

    // Table 'Membership'
    db.run(`
        CREATE TABLE Membership(
            membershipId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            groupId INTEGER NOT NULL,
            userId INTEGER NOT NULL,
            accepted BOOLEAN,
            wait BOOLEAN, 
            role TEXT NOT NULL CHECK (role IN ('user', 'owner', 'admin')),
            lesser_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN userId < groupId THEN userId ELSE groupId END),
            bigger_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN userId < groupId THEN groupId ELSE userId END),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lesser_id, bigger_id),
            FOREIGN KEY(groupId) REFERENCES Groups(groupId) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES Users(userId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Membership" table', err.message)
        } else {
            console.log('Table Membership created')
        }
    }),

    // Table 'GroupMessages'
    db.run(`
        CREATE TABLE GroupMessages(
            groupMessageId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_group INTEGER NOT NULL,
            content VARCHAR(500) NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(from_user) REFERENCES Users(userId),
            FOREIGN KEY(to_group) REFERENCES Groups(groupId)
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "GroupMessages" table', err.message)
        } else {
            console.log('Table GroupMessages created')
        }
    }),

    // Insert some data for testing (Users) (TO REMOVE)
    /* 
        user1@email.com   123     
        user2@email.com   123
        user3@email.com   123
    */
    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['user1@email.com', 'user1', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added to database: user1@email.com, user1, 123')
        }
    }),

    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['user2@email.com', 'user2', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added to database: user2@email.com, user2, 123')
        }
    }),

    db.run(`
        
        INSERT INTO Users(email, username, password) VALUES (?, ?, ?)

    `, ['user3@email.com', 'user3', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added to database: user3@email.com, user3, 123')
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

    // Insert some data for testing (Friendship) (TO REMOVE)
    db.run(`
        
        INSERT INTO Friendship(from_user, to_user, accepted, wait) VALUES (?, ?, ?, ?)

    `, [1, 2, true, false], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    db.run(`
        
        INSERT INTO Friendship(from_user, to_user, accepted, wait) VALUES (?, ?, ?, ?)

    `, [1, 3, true, false], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    })

    // Insert some data for testing (Groups and Membership) (TO REMOVE)
    db.run(`
        
        INSERT INTO Groups(name, owner, description) VALUES (?, ?, ?)

    `, ['Group 1', 1, 'Description 1'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    }),

    db.run(`
        
        INSERT INTO Membership(groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)

    `, [1, 1, true, false, 'owner'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    })

    db.run(`
        
        INSERT INTO Membership(groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)

    `, [1, 2, true, false, 'admin'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
        }
    })

    db.run(`
        
        INSERT INTO Membership(groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)

    `, [1, 3, true, false, 'user'], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added')
            console.log('------')
        }
    })

})

module.exports = db 