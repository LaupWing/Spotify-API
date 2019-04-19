const clickMe = document.getElementById('clickMe');
const idontWanna = document.getElementById('idontWanna');
const container = document.getElementById('container');
const overlayPanelLeft = document.querySelector('.overlay-panel.overlay-left')

clickMe.addEventListener('click', ()=> 
container.classList.add('right-panel-active'))

idontWanna.addEventListener('click', ()=> 
container.classList.remove('right-panel-active'))

overlayPanelLeft.addEventListener('mousemove', ()=>{
    console.log(event)
})