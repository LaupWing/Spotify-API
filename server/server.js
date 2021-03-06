const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const oauth = require("./oauth")
const game = require("./game")
const session = require('express-session')
// const server = app.listen(port, ()=>console.log(`Server is listening to port ${port}`))

const http = require('http').Server(app)
const io = require('socket.io')(http)
// const getData = require('./helper')

app
    .set('view engine', 'ejs')
    .set('views', 'view')
    .set('socketio', io)
    .use(session({
        secret: "Spotify",
        cookie: {secure: false},
        resave: false,
        saveUninitialized: true
    }))
    .use(oauth)
    .use("/game", game)
    .use(express.static("static"))

// Ask wooter voor unique value in prop
// function onlyUnique(prop){
//     return function(value, index, self){
//         console.log(self.indexOf(value[prop]))
//         return self.indexOf(value[prop]) === index
//     }
// }

http.listen(port, ()=>console.log(`Server is listening on port ${port}`))

