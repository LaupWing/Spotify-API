const express = require("express")
const app = express()
const port = 3000
const oauth = require("./oauth")
const game = require("./game")
const session = require('express-session')
const server = app.listen(port, ()=>console.log(`Server is listening to port ${port}`))
const io = require('socket.io')(server)

app
    .set('view engine', 'ejs')
    .set('views', 'view')
    .use(session({
        secret: "Spotify",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    }))
    .use(oauth)
    .use("/game",game)
    .use(express.static("static"))
    
io.on('connection', (socket)=>{
    console.log(`user is connected on socket${socket.id}`)
    // socket.on('logged in',()=>{
    //     socket.emit('data', req.session.data)
    // })
})