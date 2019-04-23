const socket = io();
socket.emit('logged in')
let time = 0

function startTimer(){
    window.timer = setInterval(()=>{
        time++
    },100)
}
document.querySelector('button#ready').addEventListener('click', ()=>{
    socket.emit('ready')
})  


// ALl socket events
socket.on('start game', (users)=>{
    const body = document.body
    removeElements(body)
    const newElement = '<main class="container"><div class="track_guess"></div><div class="track_reveal-container"><img></img><div class="track-reveal"><h2 class="artist_name"></h2><p class="song_name"></p></div></div></main><form id="player_answer"><div class="answer-container"><div class="answer"><h2>Artist</h2><input class="artist_input" type="text"></div><p>-</p><div class="answer"><h2>Song</h2><input class="song_input" type="text"></div></div><button>confirm</button></form><ul id="users"></ul>'
    body.insertAdjacentHTML('beforeend', newElement)
    addingItemsToUL(document.getElementById('users'), users)
    const audioTime = '<div class="audio_time"></div>'
    document.querySelector('.track_guess').insertAdjacentHTML('beforeend', audioTime)
    socket.emit('get track')
})

socket.on('user indicator', (id)=>{
    const all_li = document.querySelectorAll('#users li')
    all_li.forEach(li=>{
        if(li.id === id){
            li.classList.add('userSelf')
        }
    })
})

socket.on('guess', (track)=>{
    console.log('guess the track')
    console.log(track)
})

socket.on('fill waiting room', (users)=>{
    console.log(users)
    addingItemsToUL(document.querySelector('#waiting_room .wrapper'), users)
})

socket.on('player ready', (obj)=>{
    console.log('Rendering Players Ready')
    addingItemsToUL(document.querySelector('#waiting_room .wrapper'), obj.users)
    document.querySelectorAll('#waiting_room li').forEach(li=>{
        obj.playersReadyArray.forEach(id=>{
            if(li.id === id){
                li.classList.add('visible')
            }
        })
    })
}) 

socket.on('send track', (track)=>{
    console.log(track)
    document.querySelector('main .track_reveal-container img').src=track.albumImg
    document.querySelector('.song_name').textContent = track.songName
    document.querySelector('.artist_name').textContent = track.artist.join(', ')
    document.querySelector('.audio_time').classList.add('playingAudio')
    document.querySelector('form#player_answer').addEventListener('submit',playersAnswer)
    startTimer()
})



// Specifik functions to do something
function playersAnswer(){
    event.preventDefault()
    clearInterval(window.timer)
    const artist = document.querySelector('input[type="text"].artist_input').value
    const song = document.querySelector('input[type="text"].song_input').value
    const answer = {
        time,
        artist,
        song
    }
    compareAnswerToSolution(answer)
}

function compareAnswerToSolution(answer){
    const artist_name = document.querySelector('h2.artist_name').innerText
    const song_name = document.querySelector('p.song_name').innerText
    console.log(artist_name,song_name)
    console.log(replaceSomeChar(artist_name))
    console.log(replaceSomeChar(sliceOutParanthesis(song_name)))
}

function replaceSomeChar(string){
    const allChar = [',', '(', ')', '.', "'", '!']
    const result = [...string].map(letter=>{
            if(allChar.includes(letter)){
                return letter.replace(letter, '')
            }else{
                return letter
            }
        }) 
        // array.forEach(char=>{
        //     result.replaceAll(result, char)
        //     console.log(result)
        // })
        console.log(result)
    
    return result.join('').toLowerCase().trim()
    // return string
    //     .replaceAll(string,',')
    //     .replaceAll(string,'(')
    //     .replaceAll(string,')')
    //     .replaceAll(string,'.')
    //     .replaceAll(string,'!')
    //     .replaceAll(string,"'")
    //     .toLowerCase()
    //     .trim()
}
function sliceOutParanthesis(string){
    const index = string.indexOf('(')
    if(index === -1) return string
    return string.slice(0, index)
}
String.prototype.replaceAll = function (target, search){
    return target.split(search).join('')
}

// Helper functions
function addingItemsToUL(ul, array){
    removeElements(ul)
    array.forEach(user=>{
        console.log('building')
        const li = document.createElement('li')
        li.id = user.socketId
        const img = document.createElement('img')
        img.src = user.imageUrl
        const h2 = document.createElement('h2')
        h2.innerText = user.name
        li.appendChild(img)
        li.appendChild(h2)
        ul.insertAdjacentElement('beforeend', li)
    })
}

function removeElements(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}