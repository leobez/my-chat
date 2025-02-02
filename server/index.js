// ENVIROMENT VARIABLE
require('dotenv').config()
const PORT = 3000

// API
const express = require('express')
const app = express()
app.use(express.json({
    verify: (req, res, buf, encoding) => { // Verify is user req has any SyntaxError's
        try {  
            if (buf && buf.length) {
                JSON.parse(buf)
            }
        } catch (error) {
            throw new SyntaxError('Invalid JSON')
        }
    }
}))

// CORS
const cors = require('cors')

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // IMPORTANT -> ALLOWS TO ATTACH JWT TOKEN TO USER COOKIES //
}

app.use(cors(corsOptions))

// COOKIE MANIPULARION
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// MIDDLEWARE THAT VALIDATES SYNTAX ERRORS ON JSON THAT WAS SENT BY USER
app.use(require('./middlewares/JsonVerifier')) 

//INITIATE DB
require('./db/db') 

// API ROUTES
const apiRouter = require('./routes/router')
app.use(apiRouter)

// WEBSOCKET
const http = require('node:http')
const httpServer = http.createServer(app) // implement HTTP server to support websockets

const { initSocket } = require('./socketHandler')
initSocket(httpServer)


httpServer.listen(PORT, () => {
    console.log(`SERVER ON ${PORT}`)
})