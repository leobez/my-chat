const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const saltRounds = 10

const app = express()

// File for saving data (temporary DB)
const DB_filePath = path.join(__dirname, 'data.json')

// MIDDLEWARES
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))
app.use(express.json())

// REST API
app.post('/api/register', (req, res) => {

    // Get data
    const {email, password} = req.body

    // Validate data
    if (email.length === 0) {
        return res.status(400).json({message: 'email empty', error: true})
    }
    if (password.length <= 3) {
        return res.status(400).json({message: 'password to short', error: true})
    }

    let hash = ''
    try {
        const salt = bcrypt.genSaltSync(saltRounds)
        hash = bcrypt.hashSync(password, salt)
    } catch (error) {
        return res.status(500).json({message: 'Error while hashing password', error: true})
    }

    // Register data on JSON (eventually a database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'cannot access DB file', error: true})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'cannot interpret json file', error: true}) 
            }
        }

        // TODO: VERIFY IF EMAIL ALREADY EXISTS
        for (let a=0; a<jsonData.length; a++) {
            if (jsonData[a].email === email) {
                return res.status(400).json({message: 'email already used', error: true}) 
            }
        }

        // Generate id to user (+1 from last)
        let lastId = -1
        if (jsonData.length > 0) {
            lastId = jsonData[jsonData.length-1].id
        } 

        const userId = lastId + 1
        
        const newData = {
            id: userId,
            email: email,
            password: hash
        }

        // Add new user to list
        jsonData.push(newData)

        // Write data on file
        fs.writeFile(DB_filePath, JSON.stringify(jsonData, null, 2), 'utf8', writeErr => {
            if (writeErr) {
                return res.status(500).json({message: 'cannot write into json file', error: true})
            }
            res.status(200).json({message: 'user registered', email: email})
        })

    })

})

app.post('/api/login', (req, res) => {

    // Get data
    const {email, password} = req.body

    // Validate data
    if (email.length === 0) {
        return res.status(400).json({message: 'email empty', error: true})
    }

    if (password.length <= 3) {
        return res.status(400).json({message: 'password to short', error: true})
    }


    // Register data on JSON (eventually a database)
    fs.readFile(DB_filePath, 'utf8', (err, data) => {

        if (err) {
            return res.status(500).json({message: 'cannot access DB file', error: true})
        }

        // Parse existing data
        let jsonData = []
        if (data) {
            try {
                jsonData = JSON.parse(data)
            } catch (error) {
                return res.status(500).json({message: 'cannot interpret json file', error: true}) 
            }
        }

        // Veryfing if user exists
        for (let a=0; a<jsonData.length; a++) {
            if (jsonData[a].email === email) {
                const isPasswordCorrect = bcrypt.compareSync(password, jsonData[a].password)
                if (isPasswordCorrect) {
                    return res.status(200).json({message: 'can login'})
                }
            }
        }

        return res.status(400).json({message: 'user does not exist', error: true})
    })
})

app.get('', (req, res) => {
    res.json({message: 'not found'})
})


// WEBSOCKET
const http = require('node:http')
const socketIO = require('socket.io')

const httpServer = http.createServer(app)
const io = new socketIO.Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
})

io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);
    
    // Escuta mensagens do cliente
    socket.on('message', (msg) => {
        console.log(`Mensagem recebida: ${msg}`);
        
        // Envia uma resposta para o cliente
        socket.emit('message', `Recebido: ${msg}`);
    });

    // Quando o cliente se desconecta
    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// Not being used yet
httpServer.listen(3000, () => {
    console.log('SERVER ON 3000')
})
