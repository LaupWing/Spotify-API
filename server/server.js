const express = require("express")
const app = express()
const port = 3000
const oauth = require("./oauth")
const game = require("./game")
const session = require('express-session')
app
    .use(session({
        secret: "Spotify",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    }))
    .use(oauth)
    .use("/game",game)
    .use(express.static("static"))
    .listen(port, ()=>console.log(`Server is listening to port ${port}`))