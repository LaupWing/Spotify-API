const express = require("express")
const app = express()
const port = 3000
const oauth = require("./oauth")
// const game = require("./game")
const session = require('express-session')
const server = app.listen(port, ()=>console.log(`Server is listening to port ${port}`))
const io = require('socket.io')(server)
let users = []
const randomNumbersArray = []
const getData = require('./helper')

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
    .use("/game", async (req,res)=>{
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
                    albumImg    :   filteredTracks.track.album.images[0],
                    songName    :   filteredTracks.track.name
                }
            })
        console.log(getRandom(req.session.data))
        io.on('connection', (socket)=>{
            console.log(`User with the id ${socket.id} has logged in`)
            socket.on('logged in',()=>{
                console.log('Logged in')
                users.push({
                    socketId    : socket.id,
                    name,
                    imageUrl: image[0].url
                })
                io.emit('users', onlyUnique('socketId',users))
                socket.emit('user indicator', socket.id)
            })
            socket.on('disconnect', ()=>{
                console.log(`User with id ${socket.id} had disconnected`)
                const filterOut = onlyUnique('socketId',users)
                    .filter(user=>user.socketId !== socket.id)
                users = filterOut
                io.emit('users', filterOut)
            })
        })
        res.render('game')
    })
    .use(express.static("static"))

// function onlyUnique(prop){
//     return function(value, index, self){
//         console.log(self.indexOf(value[prop]))
//         return self.indexOf(value[prop]) === index
//     }
// }

function onlyUnique(prop, array){
    const uniques = []
    array.forEach(item=>{
        if(uniques.length !== 0){
            if(!arrayIncludesInObj(uniques, prop, item[prop])){
                uniques.push(item)
            }
        }
        else uniques.push(item)
    })
    console.log(uniques)
    return uniques
}

function arrayIncludesInObj (arr, key, valueToCheck){
    let found = false;
  
    arr.some(value => {
      if (value[key] === valueToCheck) {
        found = true;
        return true; // this will break the loop once found
      }
    });
    return found;
}

function getRandom(array){
    let number
    if(randomNumbersArray.length===0){ 
        number = randomNumber(array)  
        randomNumbersArray.push(number)
    }
    else{
        for(let i=0;i<=array.length;i++){
            number = randomNumber(array)
            if(randomNumbersArray.indexOf(number) === -1){
                randomNumbersArray.push(number)
            }
            else i--
        }
    }
    return array[number]
}

function randomNumber(array){
    return Math.floor(Math.random()*array.length)
}

function trimSong(song){
	const index = song.indexOf('(')
	return song.slice(0,index).trim()
}