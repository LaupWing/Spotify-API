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

// ALl socket events on chronologica order
// -------------------
socket.on('start game', users=>createGameEnviroment(users))
socket.on('fill waiting room', users=>addingItemsToUL(document.querySelector('#waiting_room .wrapper'), users))
socket.on('player ready', obj=>setPlayersReady(obj)) 
socket.on('user indicator', id=>setUserIndicator(id))
socket.on('send track', track=>setTrack(track))
socket.on('guess', (track)=>{})

// Functions that are called by the socket events.
// -------------------
function createGameEnviroment(users){
    console.log(`Rendering Users... ${users}`)
    const body = document.body
    removeElements(body)
    const newElement = '<main class="container"><div id="time_is_up"><h2>Time is up<h2><p>The Answer is</p></div><div id="media"></div><div class="track_guess"><h2>Track starts in</h2><div class="readyMsg"></div></div><div class="track_reveal-container"><img></img><div class="track-reveal"><h2 class="artist_name"></h2><p class="song_name"></p></div></div></main><form id="player_answer"><div class="answer-container"><div class="answer"><h2>Artist</h2><input class="artist_input" type="text"><p class="user_artist_guess"></p></div><p>-</p><div class="answer"><h2>Song</h2><input class="song_input" type="text"><p class="user_song_guess"></p></div></div><button>confirm</button></form><ul id="users"></ul>'
    body.insertAdjacentHTML('beforeend', newElement)
    addingItemsToUL(document.getElementById('users'), users)
    const audioTime = '<div class="audio_time"></div>'
    document.querySelector('.track_guess').insertAdjacentHTML('beforeend', audioTime)
    setUpSVG()
    socket.emit('get track')
}

function setUserIndicator(id){
    const all_li = document.querySelectorAll('#users li')
    all_li.forEach(li=>{
        if(li.id === id){
            li.classList.add('userSelf')
        }
    })
}

function setPlayersReady(obj){
    console.log('Rendering Players Ready')
    addingItemsToUL(document.querySelector('#waiting_room .wrapper'), obj.users)
    document.querySelectorAll('#waiting_room li').forEach(li=>{
        obj.playersReadyArray.forEach(id=>{
            if(li.id === id){
                li.classList.add('visible')
            }
        })
    })
}

function setTrack(track){
    console.log('Setting up track enviroment')
    console.log(track)
    document.querySelector('.song_name').textContent = track.songName
    document.querySelector('.artist_name').textContent = track.artist.join(', ')
    createAudioElement(track.preview_url)
    document.querySelector('form#player_answer').addEventListener('submit',playersAnswer)
    document.querySelector('main .track_reveal-container img').src=track.albumImg
    startTimer()
    // staring Countdown
    startingAnimation()
}

function createAudioElement(src){
    var audio = document.createElement('audio');
    var source = document.createElement('source');
    var media = document.getElementById('media');
    media.appendChild(audio);
    audio.appendChild(source);
    source.setAttribute('src', src);
    source.setAttribute('type', 'audio/mpeg');
    audio.setAttribute('controls', 'controls');
}

function setUpSVG(){
    const svgFace = '<svg id="Face" viewBox="0 0 595.28 222"><title>face</title><g id="Left_Eye" data-name="Left Eye"><circle class="black" cx="79.34" cy="74.66" r="31"/><path class="white" d="M91.61,74.66A12.27,12.27,0,0,1,79.34,86.94a12.07,12.07,0,0,1-5.62-1.37,7,7,0,1,1-6.65-9.25h.11a13.13,13.13,0,0,1-.11-1.67,12.27,12.27,0,0,1,24.54,0Z"/></g><g id="Right_Eye" data-name="Right Eye"><circle class="black" cx="515.94" cy="74.66" r="31"/><path class="white" d="M528.21,74.66a12.28,12.28,0,0,1-12.27,12.28,12.07,12.07,0,0,1-5.62-1.37,7,7,0,1,1-6.66-9.25h.11a13.13,13.13,0,0,1-.11-1.67,12.28,12.28,0,0,1,24.55,0Z"/></g><path id="Mouth" class="black" d="M338,133.66c0,.18,0,.36,0,.54a48.25,48.25,0,0,1-96.49,0c0-.18,0-.36,0-.54a10.53,10.53,0,0,1,21.06,0,27.19,27.19,0,1,0,54.38,0h0a10.53,10.53,0,0,1,21.06,0Z"/></svg>'

    const svgPlayBtn = '<svg id="play_btn" viewBox="0 0 404.43 404.43"><title>playbtn</title><circle id="mainCircle" class="black2" cx="202.21" cy="202.21" r="202.21"/><path id="outline" class="green" d="M41,202.21A161,161,0,0,0,42,219.59l-19.81,7.72a183.93,183.93,0,0,1,0-50.19L42,184.84A160.8,160.8,0,0,0,41,202.21Z"/><path id="outline-2" data-name="outline" class="green" d="M161.33,46.25A161.51,161.51,0,0,0,46.25,161.31L27,153.78A182.08,182.08,0,0,1,153.81,27Z"/><path id="outline-3" data-name="outline" class="green" d="M227.25,22.14l-7.71,19.8a163.78,163.78,0,0,0-34.67,0l-7.72-19.8a184.34,184.34,0,0,1,50.1,0Z"/><path id="outline-4" data-name="outline" class="green" d="M376.4,150l-19.27,7.52A161.52,161.52,0,0,0,243.07,46.24l7.52-19.3A182.13,182.13,0,0,1,376.4,150Z"/><path id="outline-5" data-name="outline" class="green" d="M384,202.21a182.74,182.74,0,0,1-2.31,29L362,223.57a163.57,163.57,0,0,0,0-42.71l19.7-7.67A183.8,183.8,0,0,1,384,202.21Z"/><path id="outline-6" data-name="outline" class="green" d="M376.4,254.39A182.21,182.21,0,0,1,255.12,376.18l-7.5-19.27a161.5,161.5,0,0,0,109.51-110Z"/><path id="outline-7" data-name="outline" class="green" d="M232,381.57a184,184,0,0,1-59.61,0l7.67-19.68a163,163,0,0,0,44.27,0Z"/><path id="outline-8" data-name="outline" class="green" d="M156.8,356.91l-7.51,19.27A182.16,182.16,0,0,1,27,250.64l19.3-7.53A161.51,161.51,0,0,0,156.8,356.91Z"/><path id="innerOutline" class="green" d="M221.39,102.14a19.2,19.2,0,0,0-38.34,0,101.4,101.4,0,1,0,38.34,0ZM202.22,298.8a97.08,97.08,0,1,1,97.08-97.08A97.07,97.07,0,0,1,202.22,298.8Z"/></svg>'

    const svgPlayBtnArrow= '<svg id="play_btn_arrow" viewBox="0 0 404.43 404.43"><title>playbtnArrow</title><polygon id="Playbutton" class="transparent" points="163.89 150.66 163.89 252.79 267.37 201.73 163.89 150.66"/></svg>'

    document.querySelector('main').insertAdjacentHTML('beforeend', svgFace)
    document.querySelector('main .track_guess').insertAdjacentHTML('beforeend', svgPlayBtn)
    document.querySelector('main .track_guess').insertAdjacentHTML('beforeend', svgPlayBtnArrow)

}

function startingAnimation(){
    document.querySelector('main svg #innerOutline').classList.add('start')
    document.querySelector('main .readyMsg').classList.add('start')
    document.querySelector('main .readyMsg.start').addEventListener('animationend',startTrack)
}

function startTrack(){
    // Start Track
    console.log('Starting Track')
    document.querySelector('main .track_guess h2').innerText = 'Guess the track'
    document.querySelector('main .track_guess .readyMsg').classList.add('invisible')
    document.querySelector('main .track_guess svg#play_btn_arrow #Playbutton').classList.remove('transparent')
    document.querySelector('main .track_guess svg#play_btn').classList.add('start')
    document.querySelector('main .track_guess .audio_time').classList.add('start')
    document.querySelector('audio').play()
    setTimeout(()=>{
        endOfTrack()
    },5000)
}

function endOfTrack(){
    document.querySelector('audio').pause()
    document.querySelector('main .track_guess svg#play_btn').classList.add('pause_animation')
    document.querySelector('main .track_guess svg#play_btn_arrow #Playbutton').classList.add('transparent')
    document.querySelector('main .track_guess .readyMsg').classList.remove('start', 'invisible')
    document.querySelector('main .track_guess .readyMsg').removeEventListener('animationend', startTrack)
    document.querySelector('main .track_guess .readyMsg').classList.add('start15')
    document.querySelector('main .track_guess .readyMsg').addEventListener('animationend', timeEnded)
}

function timeEnded(){
    document.querySelector('main #time_is_up').classList.add('visible')
    document.querySelector('main svg #innerOutline').classList.add('pause_animation')
    document.querySelector('main #time_is_up h2').classList.add('start')
    document.querySelector('main #time_is_up p:first-of-type').classList.add('start')
    document.querySelector('main #time_is_up p:first-of-type').addEventListener('animationend', revealTrack)
}

function revealTrack(){
    document.querySelector('main #time_is_up').classList.remove('visible')
    setTimeout(()=>{
        document.querySelector('main #time_is_up h2').classList.remove('start')
        document.querySelector('main #time_is_up p:first-of-type').classList.remove('start')
    },3000)
    document.querySelector('main svg#Face').classList.add('reveal')
    setTimeout(()=>{
        nextSong()
    },8000)
}

function nextSong(){
    document.querySelector('main .track_guess .readyMsg').removeEventListener('animationend', timeEnded)
    document.querySelector('main svg#Face').classList.remove('reveal')
    document.querySelector('main .track_guess h2').innerText = 'Track starting in'
    document.querySelector('main svg #innerOutline').classList.remove('start','pause_animation')
    document.querySelector('main .readyMsg').classList.remove('start', 'start15')
    document.querySelector('main .track_guess svg#play_btn').classList.remove('start', 'pause_animation')
    document.querySelector('main .track_guess .audio_time').classList.remove('start')
    removeElements(document.querySelector('#media'))
    document.querySelector('main svg#Face').addEventListener('transitionend',getTrackEmit)
}

function resetTimer(){
    clearInterval(window.timer)
    time= 0;
}

function getTrackEmit(){
    socket.emit('get track')
    document.querySelector('main svg#Face').removeEventListener('transitionend',getTrackEmit)
}

function playersAnswer(){
    event.preventDefault()
    resetTimer
    const artist = document.querySelector('input[type="text"].artist_input').value
    const song = document.querySelector('input[type="text"].song_input').value
    const answer = {
        time,
        artist,
        song
    }
    renderAnswer(answer)
    compareAnswerToSolution(answer)
    removeFormItems()
}

function removeFormItems(){
    const inputs = document.querySelectorAll('form .answer-container div input[type="text"]')
    const submitBtn = document.querySelector('form button')

    inputs.forEach(input=>{
        console.log(input)
        input.classList.add('start')
        input.setAttribute('disabled', true)
    })
    submitBtn.classList.add('start')
    submitBtn.setAttribute('disabled', true)
}

function renderAnswer(answer){
    const user_song_guess = document.querySelector('form .answer-container .user_song_guess')
    const user_artist_guess = document.querySelector('form .answer-container .user_artist_guess')
    user_song_guess.innerText = answer.song
    user_artist_guess.innerText = answer.artist

    user_song_guess.classList.add('start')
    user_artist_guess.classList.add('start')
}

function compareAnswerToSolution(answer){
    const artist_name = document.querySelector('h2.artist_name').innerText
    const song_name = document.querySelector('p.song_name').innerText
    console.log(artist_name,song_name)
    console.log(replaceSomeChar(artist_name))
    console.log(replaceSomeChar(sliceOutParanthesis(song_name)))
}


// Helper functions
// -------------------
function replaceSomeChar(string){
    const allChar = [',', '(', ')', '.', "'", '!']
    const result = [...string].map(letter=>{
            if(allChar.includes(letter)){
                return letter.replace(letter, '')
            }else{
                return letter
            }
        }) 
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
// ASK WOOOOOOOTEEER
// Help with classes
String.prototype.replaceAll = function (target, search){
    return target.split(search).join('')
}

function addingItemsToUL(ul, array){
    removeElements(ul)
    array.forEach(user=>{
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

function removeSelf(item){
    item.parentElement.removeChild(this)
}