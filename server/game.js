const express = require("express")
const router = express.Router()
let users = []
let playersReadyArray =[]
let emittingArray = []
let answers = []
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
    function newPlayerLoggedIn(socket_id){
        console.log('Logged in')
        users.push({
            socketId    : socket_id,
            name,
            imageUrl: image[0].url
        })
        io.emit('fill waiting room', onlyUnique('socketId',users))
        // socket.emit('user indicator', socket.id)
    }

    function playerHasDisconnected(socket_id){
        console.log(`User with id ${socket_id} had disconnected`)
        const filterOut = onlyUnique('socketId',users)
            .filter(user=>user.socketId !== socket_id)
        users = filterOut
        playersReadyArray = playersReadyArray.filter(id=>id!==socket_id)
        io.emit('users', filterOut)
    }

    function playerIsReady(socket_id){
        // console.log('Player is ready')
        playersReadyArray.push(socket_id)
        const playerObj = {
            users,
            playersReadyArray
        }
        io.emit('player ready', playerObj)
        if(playersReadyArray.length === users.length){
            io.emit('start game', onlyUnique('socketId',users))
        }
    }

    function getTrack(socket_id){
        // resetArray(askTrack, socket_id)
        emittingArray.push(socket_id)
        // console.log(`Requesting track by ${socket_id}`)
        onlyFirstUserEmits(socket_id,()=>{
            io.emit('send track', getRandom(req.session.data))
        })
    }
    function getName(socket_id){
        return users
        .filter(user=>user.socketId === socket_id)
        .map(user=>user.name)
        
    }
    
    function onlyFirstUserEmits(id, action){
        if(users[0].socketId === id){
            console.log('---------------------->>')
            action()
        }
    }

    function resetArray(array){
        array.length = 0
    }

    function gettinResults(answer, id){         
        answers.push({
            name: users
                .filter(user=>user.socketId===id)
                .map(user=>user.name)[0],
            answer,
            id 
        })
    }
    
    function renderingResults(){
        console.log(answers.length, users.length)
        console.log(answers)
        if(answers.length === users.length){
            console.log('emitting results')
            emittingArray = []
            io.emit('sending results', answers)
        }else if(answers.length >0) io.emit('sending results', answers)
    }

    function idontfkingknow(socket_id){
        return getName(socket_id)[0]
    }

    io.on('connection', (socket)=>{
        console.log(`User with the id ${socket.id} has logged in`)
        socket_id.push(socket.id)
        if(socket_id[0] === socket.id){
            io.removeAllListeners('connection')
        }
        // All the custom socket events
        socket.on('logged in',()=>newPlayerLoggedIn(socket.id))
        socket.on('disconnect', ()=>playerHasDisconnected(socket.id))
        socket.on('ready', ()=>playerIsReady(socket.id))
        socket.on('get track',()=>getTrack(socket.id))
        socket.on('idunno', ()=>socket.emit('userDoesntKnow',idontfkingknow(socket.id)))
        socket.on('answer',(answer)=>{gettinResults(answer, socket.id)})
        socket.on('reset results',()=>resetArray(answers))
        socket.on('request results',()=>onlyFirstUserEmits(socket.id,()=>renderingResults()))
    })
    res.render('game', {
        // data: getRandom(req.session.data) 
    })
})

module.exports = router