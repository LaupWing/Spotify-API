const socket = io();
socket.emit('logged in')
socket.on('data', (data)=>{console.log(data)})