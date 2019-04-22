const express = require("express")
const router = express.Router()
let users = []
const playersReadyArray =[]
const {getData} = require('./helper')
const {getRandom} = require('./helper')
const {onlyUnique} = require('./helper')

router.get('/', async(req,res)=>{
    const io = req.app.get('socketio')
    let socket_id = []

    const tracks = await getData({
        endpoint        :   'playlists/2f6tXtN0XesjONxicAzMIw/tracks',
        acces_token     :   req.session.acces_token,
        output          :   'items'
    })

    const name = await getData({
        endpoint        :   'me',
        acces_token     :   req.session.acces_token,
        output          :   'display_name'
        
    })

    const image = await getData({
        endpoint        :   'me',
        acces_token     :   req.session.acces_token,
        output          :   'images'
        
    })
    req.session.data = tracks
        .filter(allTracks=>allTracks.track.preview_url !== null)
        .map((filteredTracks)=>{
            return{
                preview_url :   filteredTracks.track.preview_url,
                artist      :   filteredTracks.track.artists
                                    .map(artist=>artist.name),
                albumImg    :   filteredTracks.track.album.images[0].url,
                songName    :   filteredTracks.track.name
            }
        })
    io.on('connection', (socket)=>{
        console.log(`User with the id ${socket.id} has logged in`)
        socket_id.push(socket.id)
        if(socket_id[0] === socket.id){
            io.removeAllListeners('connection')
        }
        socket.on('logged in',()=>{
            console.log('Logged in')
            // console.log('Loggin Results',getRandom(req.session.data))
            users.push({
                socketId    : socket.id,
                name,
                imageUrl: image[0].url
            })
            io.emit('fill waiting room', onlyUnique('socketId',users))
            // io.emit('users', onlyUnique('socketId',users))
            // Dit hieronder doet het niet??? Zodra deze function word aangeropen doet ie het niet
            // ONtdekking!: het komt door mijn function getRandom?
            // const test = 'test'
            // console.log(req.session.data)
            // console.log(getRandom(req.session.data))
            getRandom(req.session.data)
            io.emit('guess', 'huh')
            // socket.emit('user indicator', socket.id)
        })
        socket.on('disconnect', ()=>{
            console.log(`User with id ${socket.id} had disconnected`)
            const filterOut = onlyUnique('socketId',users)
                .filter(user=>user.socketId !== socket.id)
            users = filterOut
            io.emit('users', filterOut)
        })
        socket.on('ready', ()=>{
            console.log('Player is ready')
            playersReadyArray.push(socket.id)
            const playerObj = {
                users,
                playersReadyArray
            }
            io.emit('player ready', playerObj)
        })
    })
    res.render('game', {
        // data: getRandom(req.session.data) 
    })
})

module.exports = router