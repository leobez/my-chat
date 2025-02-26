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
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Users" table', err.message)
        } else {
            console.log('------')
            console.log('Table Users created')
        }
    }),

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_users_updated_at
        AFTER UPDATE ON Users
        FOR EACH ROW
        BEGIN
            UPDATE Users
            SET updated_at = CURRENT_TIMESTAMP
            WHERE userId = OLD.userId;
        END;
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Users" update trigger', err.message)
        } else {
            console.log('Trigger for Users created')
        }
    }),

    // Table 'Friendship'
    db.run(`
        CREATE TABLE Friendship(
            friendshipId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_user INTEGER NOT NULL,
            from_username VARCHAR(255),
            to_username VARCHAR(255),
            accepted BOOLEAN,
            wait BOOLEAN,
            lesser_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN from_user < to_user THEN from_user ELSE to_user END),
            bigger_id INTEGER NOT NULL GENERATED AlWAYS AS (CASE WHEN from_user < to_user THEN to_user ELSE from_user END),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lesser_id, bigger_id),
            FOREIGN KEY(from_user) REFERENCES Users(userId) ON DELETE CASCADE,
            FOREIGN KEY(to_user) REFERENCES Users(userId) ON DELETE CASCADE
        ); 
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" table', err.message)
        } else {
            console.log('Table Friendship created')
        }
    }),

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_friendship_updated_at
        AFTER UPDATE ON Friendship
        FOR EACH ROW
        BEGIN
            UPDATE Friendship
            SET updated_at = CURRENT_TIMESTAMP
            WHERE friendshipId = OLD.friendshipId;
        END;
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" update trigger', err.message)
        } else {
            console.log('Trigger for Friendship created')
        }
    }),
    
    // Trigger to insert usernames of users of a friendship
    db.run(`
        CREATE TRIGGER update_friendship_usernames_on_insert
        AFTER INSERT ON Friendship
        FOR EACH ROW
        BEGIN
            UPDATE Friendship
        SET 
            from_username = (SELECT username FROM Users WHERE userId = NEW.from_user),
            to_username = (SELECT username FROM Users WHERE userId = NEW.to_user)
            WHERE friendshipId = NEW.friendshipId;
        END;
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" update trigger', err.message)
        } else {
            console.log('Trigger for Friendship created')
        }
    }),

    // Trigger to update usernames when they are updated on Users table
    db.run(`
        CREATE TRIGGER update_friendship_usernames_on_user_update
        AFTER UPDATE OF username ON Users
        FOR EACH ROW
        BEGIN
            UPDATE Friendship
            SET from_username = NEW.username
            WHERE from_user = OLD.userId;

            UPDATE Friendship
            SET to_username = NEW.username
            WHERE to_user = OLD.userId;
        END;
    `, (err) => {
        if (err) {
            console.log('Error while creating "Friendship" update trigger', err.message)
        } else {
            console.log('Trigger for Friendship created')
        }
    }),

    // Table 'Messages' (Private messages)
    db.run(`
        CREATE TABLE Messages(
            messageId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            from_username VARCHAR(255),
            to_user INTEGER NOT NULL,
            to_username VARCHAR(255),
            content VARCHAR(500) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(from_user) REFERENCES Users(userId) ON DELETE CASCADE,
            FOREIGN KEY(to_user) REFERENCES Users(userId) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Messages" table', err.message)
        } else {
            console.log('Table Messages created')
        }
    }),

    // Trigger to insert usernames of users of a friendship
    db.run(`
        CREATE TRIGGER update_messages_usernames_on_insert
        AFTER INSERT ON Messages
        FOR EACH ROW
        BEGIN
            UPDATE Messages
        SET 
            from_username = (SELECT username FROM Users WHERE userId = NEW.from_user),
            to_username = (SELECT username FROM Users WHERE userId = NEW.to_user)
            WHERE messageId = NEW.messageId;
        END;
    `, (err) => {
        if (err) {
            console.log('Error while creating "Message" update trigger', err.message)
        } else {
            console.log('Trigger for Messages created')
        }
    }),

    // Table 'Groups'
    db.run(`
        CREATE TABLE Groups(
            groupId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name VARCHAR(40) NOT NULL,
            owner INTEGER NOT NULL,
            description VARCHAR(200) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(owner) REFERENCES Users(userId) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Groups" table', err.message)
        } else {
            console.log('Table Groups created')
        }
    }),

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_groups_updated_at
        AFTER UPDATE ON Groups
        FOR EACH ROW
        BEGIN
            UPDATE Groups
            SET updated_at = CURRENT_TIMESTAMP
            WHERE groupId = OLD.groupId;
        END;
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Groups" update trigger', err.message)
        } else {
            console.log('Trigger for Groups created')
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lesser_id, bigger_id),
            FOREIGN KEY(groupId) REFERENCES Groups(groupId) ON DELETE CASCADE,
            FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Membership" table', err.message)
        } else {
            console.log('Table Membership created')
        }
    }),

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_membership_updated_at
        AFTER UPDATE ON Membership
        FOR EACH ROW
        BEGIN
            UPDATE Membership
            SET updated_at = CURRENT_TIMESTAMP
            WHERE membershipId = OLD.membershipId;
        END;
        )
    `, (err) => {
        if (err) {
            console.log('Error while creating "Membership" update trigger', err.message)
        } else {
            console.log('Trigger for Membership created')
        }
    }),

    // Table 'GroupMessages'
    db.run(`
        CREATE TABLE GroupMessages(
            groupMessageId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            from_user INTEGER NOT NULL,
            to_group INTEGER NOT NULL,
            content VARCHAR(500) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

    db.run(`
        
        INSERT INTO Users(username, password) VALUES (?, ?)
    
    `, ['user1', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added to database: user1, 123')
        }
    }),
    
    db.run(`
        
        INSERT INTO Users(username, password) VALUES (?, ?)
    
    `, ['user2', hash], (err) => {
        
        if (err) {
            console.log('Error while inserting test data: ', err.message)
        } else {
            console.log('Test data added to database: user2, 123')
        }
    })

})

module.exports = db 