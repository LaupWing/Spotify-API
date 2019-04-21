const socket = io();
socket.emit('logged in')
socket.on('users', (users)=>{
    users.forEach(user=>{
        const li = document.createElement('li')
        const img = document.createElement('img')
        img.src = user.imageUrl
        const h2 = document.createElement('h2')
        h2.innerText = user.name
        li.appendChild(img)
        li.appendChild(h2)
        document.getElementById('users').insertAdjacentElement("beforeend",li)
    })
})

function removeElements(container, el){
    while(container.firstChild){
        
    }
}