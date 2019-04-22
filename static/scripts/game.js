const socket = io();
socket.emit('logged in')

document.querySelector('button#ready').addEventListener('click', ()=>{
    socket.emit('ready')
})  


// ALl socket events
socket.on('start game', (users)=>{
    const body = document.body
    removeElements(body)
    const newElement = '<main class="container"><div class="track_guess"></div><div class="track_reveal-container"><img></img><div class="track-reveal"><h2 class="artist_name"></h2><p class="song_name"></p></div></div></main><form><div class="answer-container"><div class="answer"><h2>Artist</h2><input type="text"></div><p>-</p><div class="answer"><h2>Song</h2><input type="text"></div></div><button>confirm</button></form><ul id="users"></ul>'
    body.insertAdjacentHTML('beforeend', newElement)
    addingItemsToUL(document.getElementById('users'), users)
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
})

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

