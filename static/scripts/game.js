const socket = io();
socket.emit('logged in')
socket.on('users', (users)=>{
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

function removeElements(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}

