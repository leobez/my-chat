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
}),

db.run(`
    
    INSERT INTO Users(username, password) VALUES (?, ?)

`, ['user3', hash], (err) => {
    
    if (err) {
        console.log('Error while inserting test data: ', err.message)
    } else {
        console.log('Test data added to database: user3, 123')
    }
}),

db.run(`
    
    INSERT INTO Users(username, password) VALUES (?, ?)

`, ['user4', hash], (err) => {
    
    if (err) {
        console.log('Error while inserting test data: ', err.message)
    } else {
        console.log('Test data added to database: user4, 123')
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
}),

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

`, [3, 1, false, true], (err) => {
    
    if (err) {
        console.log('Error while inserting test data: ', err.message)
    } else {
        console.log('Test data added')
    }
}),

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
}),

db.run(`
    
    INSERT INTO Membership(groupId, userId, accepted, wait, role) VALUES (?, ?, ?, ?, ?)

`, [1, 2, true, false, 'admin'], (err) => {
    
    if (err) {
        console.log('Error while inserting test data: ', err.message)
    } else {
        console.log('Test data added')
    }
}),

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