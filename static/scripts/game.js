const socket = io();
socket.emit('logged in')

document.querySelector('button#ready').addEventListener('click', ()=>{
    socket.emit('ready')
})  

socket.on('users', function(users){
    console.log('Currently Online users')
    const ul = document.getElementById('users')
    removeElements(ul)
    users.forEach(user=>{
        const li = document.createElement('li')
        li.id = user.socketId
        const img = document.createElement('img')
        img.src = user.imageUrl
        const h2 = document.createElement('h2')
        h2.innerText = user.name
        li.appendChild(img)
        li.appendChild(h2)
        ul.insertAdjacentElement("beforeend",li)
    })
})

socket.on('user indicator', (id)=>{
    const all_li = document.querySelectorAll('#users li')
    all_li.forEach(li=>{
        if(li.id === id){
            li.classList.add('userSelf')
        }
    })
})

socket.on('guess', function(track){
    console.log('guess the track')
    console.log(track)
})
socket.on('fill waiting room', (users)=>{
    console.log(users)
    addingItemsToUL(document.querySelector('#waiting_room .wrapper'), users)
})
socket.on('player ready', (obj)=>{
    console.log('Rendering Players Ready')
    console.log(obj.playersReadyArray)
    addingItemsToUL(document.querySelector('#waiting_room .wrapper'), obj.users)
    document.querySelectorAll('#waiting_room li').forEach(li=>{
        // console.log(li.id, obj.player)
        // if(li.id === obj.player){
        //     li.classList.add('visible')
        // }
        obj.playersReadyArray.forEach(id=>{
            if(li.id === id){
                li.classList.add('visible')
            }
        })
    })
}) 

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

