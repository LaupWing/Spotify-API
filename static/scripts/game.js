const socket = io();
socket.emit('logged in')

// Helper Functions
import {replaceSomeChar} from './helper.js'
import {sliceOutPandD} from './helper.js'
import {sliceAfterComma} from './helper.js'
import {addingUsersToUL} from './helper.js'
import {removeElements} from './helper.js'

// Global variables
let time = 0
let flag = true

// ALl socket events on chronologica order
// -------------------
socket.on('start game', users=>createGameEnviroment(users))
socket.on('fill waiting room', users=>addingUsersToUL(document.querySelector('#waiting_room .wrapper'), users))
socket.on('player ready', obj=>setPlayersReady(obj)) 
socket.on('user indicator', id=>setUserIndicator(id))
socket.on('send track', track=>sendTrackTo(track))
socket.on('guess', (track)=>{})
socket.on('sending results', results=>renderingResults(results))

// Functions for in the waiting room for the players.
// -------------------
document.querySelector('button#ready').addEventListener('click', ()=>{
    socket.emit('ready')
})  
function setPlayersReady(obj){
    addingUsersToUL(document.querySelector('#waiting_room .wrapper'), obj.users)
    document.querySelectorAll('#waiting_room li').forEach(li=>{
        obj.playersReadyArray.forEach(id=>{
            if(li.id === id){
                li.classList.add('visible')
            }
        })
    })
}

// Functions in the game page.
// -------------------
// These function below are played in chronological order
// The function will call the function below
// You can see this as the lifecycle of the script

// Creating the game page elements
// ###
function createGameEnviroment(users){
    const body = document.body
    removeElements(body)
    const newElement = `
        <main class="container">
            <div id="time_is_up">
                <h2>Time is up<h2>
                <p>The Answer is</p>
            </div>
            <div id="media"></div>
            <div id="results"></div>
            <div class="track_guess">
                <h2>Track starts in</h2>
                <div class="readyMsg"></div>
                <div class="audio_time"></div>
            </div>
            <div class="track_reveal-container">
                <img></img>
                <div class="track-reveal">
                    <h2 class="artist_name"></h2>
                    <p class="song_name"></p>
                </div>
            </div>
        </main>
        <form id="player_answer">
            <div class="answer-container">
                <div class="answer">
                    <h2>Artist</h2>
                    <input class="artist_input" type="text">
                    <p class="user_artist_guess"></p>
                </div>
                <p>-</p>
                <div class="answer">
                    <h2>Song</h2>
                    <input class="song_input" type="text"><p class="user_song_guess">
                    </p>
                </div>
            </div>
            <button>confirm</button>
        </form>
        <ul id="users"></ul>
        <ul id="track_list">
            <h1>Track List</h1>
        </ul>
    `

    body.insertAdjacentHTML('beforeend', newElement)
    // Adding all users in an UL elemenet
    addingUsersToUL(document.getElementById('users'), users)
    // Setting up scores for the Users
    addScoreElement()
    // Adding SVG element
    setUpSVG()
    // Gettting the first track
    socket.emit('get track')
}

function setUpSVG(){
    const svgFace = '<svg id="Face" viewBox="0 0 595.28 222"><title>face</title><g id="Left_Eye" data-name="Left Eye"><circle class="black" cx="79.34" cy="74.66" r="31"/><path class="white" d="M91.61,74.66A12.27,12.27,0,0,1,79.34,86.94a12.07,12.07,0,0,1-5.62-1.37,7,7,0,1,1-6.65-9.25h.11a13.13,13.13,0,0,1-.11-1.67,12.27,12.27,0,0,1,24.54,0Z"/></g><g id="Right_Eye" data-name="Right Eye"><circle class="black" cx="515.94" cy="74.66" r="31"/><path class="white" d="M528.21,74.66a12.28,12.28,0,0,1-12.27,12.28,12.07,12.07,0,0,1-5.62-1.37,7,7,0,1,1-6.66-9.25h.11a13.13,13.13,0,0,1-.11-1.67,12.28,12.28,0,0,1,24.55,0Z"/></g><path id="Mouth" class="black" d="M338,133.66c0,.18,0,.36,0,.54a48.25,48.25,0,0,1-96.49,0c0-.18,0-.36,0-.54a10.53,10.53,0,0,1,21.06,0,27.19,27.19,0,1,0,54.38,0h0a10.53,10.53,0,0,1,21.06,0Z"/></svg>'

    const svgPlayBtn = '<svg id="play_btn" viewBox="0 0 404.43 404.43"><title>playbtn</title><circle id="mainCircle" class="black2" cx="202.21" cy="202.21" r="202.21"/><path id="outline" class="green" d="M41,202.21A161,161,0,0,0,42,219.59l-19.81,7.72a183.93,183.93,0,0,1,0-50.19L42,184.84A160.8,160.8,0,0,0,41,202.21Z"/><path id="outline-2" data-name="outline" class="green" d="M161.33,46.25A161.51,161.51,0,0,0,46.25,161.31L27,153.78A182.08,182.08,0,0,1,153.81,27Z"/><path id="outline-3" data-name="outline" class="green" d="M227.25,22.14l-7.71,19.8a163.78,163.78,0,0,0-34.67,0l-7.72-19.8a184.34,184.34,0,0,1,50.1,0Z"/><path id="outline-4" data-name="outline" class="green" d="M376.4,150l-19.27,7.52A161.52,161.52,0,0,0,243.07,46.24l7.52-19.3A182.13,182.13,0,0,1,376.4,150Z"/><path id="outline-5" data-name="outline" class="green" d="M384,202.21a182.74,182.74,0,0,1-2.31,29L362,223.57a163.57,163.57,0,0,0,0-42.71l19.7-7.67A183.8,183.8,0,0,1,384,202.21Z"/><path id="outline-6" data-name="outline" class="green" d="M376.4,254.39A182.21,182.21,0,0,1,255.12,376.18l-7.5-19.27a161.5,161.5,0,0,0,109.51-110Z"/><path id="outline-7" data-name="outline" class="green" d="M232,381.57a184,184,0,0,1-59.61,0l7.67-19.68a163,163,0,0,0,44.27,0Z"/><path id="outline-8" data-name="outline" class="green" d="M156.8,356.91l-7.51,19.27A182.16,182.16,0,0,1,27,250.64l19.3-7.53A161.51,161.51,0,0,0,156.8,356.91Z"/><path id="innerOutline" class="green" d="M221.39,102.14a19.2,19.2,0,0,0-38.34,0,101.4,101.4,0,1,0,38.34,0ZM202.22,298.8a97.08,97.08,0,1,1,97.08-97.08A97.07,97.07,0,0,1,202.22,298.8Z"/></svg>'

    const svgPlayBtnArrow= '<svg id="play_btn_arrow" viewBox="0 0 404.43 404.43"><title>playbtnArrow</title><polygon id="Playbutton" class="transparent" points="163.89 150.66 163.89 252.79 267.37 201.73 163.89 150.66"/></svg>'

    document.querySelector('main').insertAdjacentHTML('beforeend', svgFace)
    document.querySelector('main .track_guess').insertAdjacentHTML('beforeend', svgPlayBtn)
    document.querySelector('main .track_guess').insertAdjacentHTML('beforeend', svgPlayBtnArrow)

}

// NEEDS TO BE UPDATED (CODE BELOW)
function setUserIndicator(id){
    const all_li = document.querySelectorAll('#users li')
    all_li.forEach(li=>{
        if(li.id === id){
            li.classList.add('userSelf')
        }
    })
}

function addScoreElement(){
    const all_li = document.querySelectorAll('#users li')
    all_li.forEach(li=>{
        const p = document.createElement('p')
        p.textContent = 0
        li.querySelector('div').insertAdjacentElement('beforeend', p)
    })
}

// Receiving track from server and setting up enviroment
// ###
// Bridge for sending the tracks to certain functions
function sendTrackTo(track){
    setTrackRevealEl(track)
    setTrackListEl(track)
}

function setTrackRevealEl(track){
    const song_name         = document.querySelector('.song_name')
    song_name.textContent   = track.songName

    const artist_name       = document.querySelector('.artist_name')
    artist_name.textContent = track.artist.join(', ')
    createAudioElement(track.preview_url)

    const form              = document.querySelector('form#player_answer') 
    form.addEventListener('submit',playersAnswer)

    const albumImg          = document.querySelector('main .track_reveal-container img')
    albumImg.src=track.albumImg
    // Starting Animation after song elements has been set
    startingAnimation()
}

function setTrackListEl(track){
    const list      = document.querySelector('#track_list')
    const container = document.createElement('div')
    container.classList.add('track_container', 'start')
    const info      = document.createElement('div')
    info.classList.add('info_container')
    const media     = document.createElement('div')
    media.classList.add('media_container')
    const img       = document.createElement('img')
    const artist    = document.createElement('h3')
    const song      = document.createElement('p')
    const audio     = document.createElement('audio')
    const source    = document.createElement('source')

    img.src = track.albumImg
    source.setAttribute('src', track.preview_url);
    source.setAttribute('type', 'audio/mpeg');
    // audio.setAttribute('controls', 'controls');
    audio.appendChild(source)
    media.appendChild(audio)
    media.appendChild(img)

    artist.textContent  = track.artist.join(', ')
    song.textContent    = track.songName
    info.appendChild(artist)
    info.appendChild(song)

    container.appendChild(media)
    container.appendChild(info)

    list.insertAdjacentElement('beforeend', container)
}

function createAudioElement(src){
    const audio  = document.createElement('audio');
    const source = document.createElement('source');
    const media  = document.getElementById('media');
    media.appendChild(audio);
    audio.appendChild(source);
    source.setAttribute('src', src);
    source.setAttribute('type', 'audio/mpeg');
    audio.setAttribute('controls', 'controls');
}

// Starting the game
// ###
function startingAnimation(){
    const innerOutline      = document.querySelector('main svg #innerOutline') 
    const readyMsg      	= document.querySelector('main .readyMsg')
    
    innerOutline.classList.add('start')
    readyMsg.classList.add('start')
    readyMsg.addEventListener('animationend',startTrack)
}
// Starting timer
function startTimer(){
    window.timer = setInterval(()=>{
        time++
    },100)
}
// Start the track
function startTrack(){
    // Start Track
    const container  = document.querySelector('main .track_guess')
    const h2         = container.querySelector('h2')
    const readyMsg   = container.querySelector('.readyMsg')
    const playArrow  = container.querySelector('svg#play_btn_arrow #Playbutton')
    const playBtn    = container.querySelector('svg#play_btn')
    const audio      = document.querySelector('audio')
    const audio_time = container.querySelector('.audio_time')

    h2.innerText = 'Guess the track'
    readyMsg.classList.add('invisible')
    playArrow.classList.remove('transparent')
    playBtn.classList.add('start')
    audio.play()
    startTimer()
    audio_time.classList.add('start')
    setTimeout(()=>{
        endOfTrack()
    },5000)
}

function endOfTrack(){
    const audio             = document.querySelector('audio')
    const svg_playBtn       = document.querySelector('main .track_guess svg#play_btn')
    const svg_playBtn_Arrow = document.querySelector('main .track_guess svg#play_btn_arrow #Playbutton')
    const readyMsg          = document.querySelector('main .track_guess .readyMsg')

    audio.pause()
    svg_playBtn.classList.add('pause_animation')
    svg_playBtn_Arrow.classList.add('transparent')
    readyMsg.classList.remove('start', 'invisible')
    readyMsg.removeEventListener('animationend', startTrack)
    readyMsg.classList.add('start15')
    readyMsg.addEventListener('animationend', endOfTrackBridge)
}

function endOfTrackBridge(){
    timeEnded()
    if(document.querySelector('form button.start') === null)playersAnswer()
}

function timeEnded(){
    const time_is_up    = document.querySelector('main #time_is_up')
    const time_is_up_h2 = time_is_up.querySelector('h2') 
    const innerOutline  = document.querySelector('main svg #innerOutline')
    const time_is_up_p  = time_is_up.querySelector('p:first-of-type') 

    time_is_up_h2.classList.add('start')
    time_is_up_p.classList.add('start')
    time_is_up_p.addEventListener('animationend', revealTrack)
    time_is_up.classList.add('visible')
    innerOutline.classList.add('pause_animation')
}

function revealTrack(){
    const time_is_up    = document.querySelector('main #time_is_up')
    const time_is_up_h2 = time_is_up.querySelector('h2')
    const time_is_up_p  = time_is_up.querySelector('p:first-of-type')
    const svgFace       = document.querySelector('main svg#Face') 

    time_is_up.classList.remove('visible')
    setTimeout(()=>{
        time_is_up_h2.classList.remove('start')
        time_is_up_p.classList.remove('start')
    },3000)
    svgFace.classList.add('reveal')
    svgFace.addEventListener('transitionend', revealResults)
}

function revealResults(){
    const tracklist = document.querySelectorAll('#track_list .track_container')
    tracklist[tracklist.length-1].classList.remove('start')

    const container = document.getElementById('results')
    setTimeout(()=>{
        document.querySelector('main svg#Face').removeEventListener('transitionend', revealResults)
        socket.emit('request results')
        container.classList.add('start')
    },1000)
    setTimeout(()=>{
        socket.emit('reset results')
        flag = true
        container.classList.remove('start')
        setTimeout(()=>{
            nextSong()
            removeElements(container)
        },1000)
    },8000)
}

function nextSong(){
    const readyMsg       = document.querySelector('main .track_guess .readyMsg')
    const svgFace        = document.querySelector('main svg#Face')
    const track_guess_h2 = document.querySelector('main .track_guess h2')
    const innerOutline   = document.querySelector('main svg #innerOutline') 
    const playBtn        = document.querySelector('main .track_guess svg#play_btn')
    const audio_time     = document.querySelector('main .track_guess .audio_time')
    const audio          = document.querySelector('#media') 

    readyMsg.removeEventListener('animationend', endOfTrackBridge)
    svgFace.classList.remove('reveal')
    track_guess_h2.innerText = 'Track starting in'
    innerOutline.classList.remove('start','pause_animation')
    readyMsg.classList.remove('start', 'start15')
    playBtn.classList.remove('start', 'pause_animation')
    audio_time.classList.remove('start')
    removeElements(audio)
    svgFace.addEventListener('transitionend',nextSongBridge)
}

function resetTimer(){
    clearInterval(window.timer)
    time= 0;
}

function nextSongBridge(){
    getTrackEmit()
    resetAnswer()
}

function getTrackEmit(){
    socket.emit('get track')
    document.querySelector('main svg#Face').removeEventListener('transitionend',nextSongBridge)
}

function playersAnswer(){
    event.preventDefault()
    console.log('submit event')
    let artist  = document.querySelector('input[type="text"].artist_input').value
    let song    = document.querySelector('input[type="text"].song_input').value
    // console.log(artist, song)
    if(artist === '' && song === ''){
        console.log('IF in playerAnswer function')
        socket.emit('idunno')
        socket.on('userDoesntKnow', (name)=>userDoesntKnow(name))
    }
    else{
        console.log('ELSE in playerAnswer function')
        const answer = {
            time,
            artist,
            song
        }
        compareAnswerToSolution(answer)
        answerMiddleware(answer)
        resetTimer()
    }
}

function userDoesntKnow(name){
    console.log(name)
    console.log('Server has send the name')
    if(flag){
        flag = false
        const artist = name
        const song   = 'I dont know this track'
        const answer = {
            time,
            artist,
            song
        }
        compareAnswerToSolution(answer)
        answerMiddleware(answer)
        resetTimer()
    }
}


function answerMiddleware(answer){
    // After the form has removed it items this functions will start
    // I can do it with a transitionend but that was way more work
    // Becaause i have to remove the transition also with transitionend
    setTimeout(()=>{
        renderAnswer(answer)
    },1000)
    removeFormItems()
}

function removeFormItems(){
    setFormItems({
        action: 'add',
        disable: true
    })
}

function renderingResults(results){
    results = Array.from(results)
    const container = document.getElementById('results')
    results.forEach(result=>{
        const div        = document.createElement('div')
        const h2         = document.createElement('h2')
        const artist     = document.createElement('p')
        const time       = document.createElement('p')
        const points     = document.createElement('p')
        h2.textContent   = result.name
        artist.innerHTML = `<span>Answer:</span> ${result.answer.input.artist} - ${result.answer.input.song}`
        time.innerHTML   = `<span>Time:</span> ${result.answer.time/10} sec`
        points.innerHTML = `<span>Points:</span> ${result.answer.points}`
        div.appendChild(h2)
        div.appendChild(artist)
        div.appendChild(time)
        div.appendChild(points)
        container.insertAdjacentElement('beforeend', div)
        document.querySelectorAll('#users li').forEach(li=>{
            if(li.id === result.id){
                const currentScore = li.querySelector('div p').textContent
                const newScore = (result.answer.points + Number(currentScore))
                li.querySelector('div p').textContent = newScore
            }
        })
    })
}

function renderAnswer(answer){
    const user_song_guess   = document.querySelector('form .answer-container .user_song_guess')
    const user_artist_guess = document.querySelector('form .answer-container .user_artist_guess')

    user_song_guess.innerText   = answer.song
    user_artist_guess.innerText = answer.artist

    user_song_guess.classList.add('start')
    user_artist_guess.classList.add('start')
}

function resetAnswer(){
    const user_song_guess   = document.querySelector('form .answer-container .user_song_guess')
    const user_artist_guess = document.querySelector('form .answer-container .user_artist_guess')

    user_song_guess.innerText   = ''
    user_artist_guess.innerText = ''

    user_song_guess.classList.remove('start')
    user_artist_guess.classList.remove('start')
    user_artist_guess.addEventListener('transitionend', resetForm)
}

function resetForm(){
    const user_artist_guess = document.querySelector('form .answer-container .user_artist_guess')
    user_artist_guess.removeEventListener('transitionend', resetForm)
    setFormItems({
        action: 'remove',
        disable: false
    })
}

function setFormItems(setting){
    const inputs = document.querySelectorAll('form .answer-container div input[type="text"]')
    const submitBtn = document.querySelector('form button')

    inputs.forEach(input=>{
        input.classList[setting.action]('start')

        if(!setting.disable)    input.value = ''
        if(setting.disable)     input.setAttribute('disabled', setting.disable)
        else                    input.removeAttribute('disabled')
    })
    
    submitBtn.classList[setting.action]('start')

    if(setting.disable)  submitBtn.setAttribute('disabled', setting.disable)
    else                submitBtn.removeAttribute('disabled')
}



function compareAnswerToSolution(answer){
    const artist_name            = document.querySelector('h2.artist_name').innerText
    const song_name              = document.querySelector('p.song_name').innerText
    const formatted_song_name    = replaceSomeChar(sliceOutPandD(song_name))
    const formatted_artist_name  = replaceSomeChar(sliceAfterComma(sliceOutPandD(artist_name)))
    const formatted_artist_guess = replaceSomeChar(sliceAfterComma(sliceOutPandD(answer.artist)))    
    const formatted_song_guess   = replaceSomeChar(sliceAfterComma(sliceOutPandD(answer.song)))
    const song_name_correct      = formatted_song_name   == formatted_song_guess
    const artist_name_correct    = formatted_artist_name == formatted_artist_guess
    const playerResult = {
        time: answer.time,
        input:{
            artist: answer.artist,
            song: answer.song
        }
    }
    if(song_name_correct && artist_name_correct){
        playerResult.points = 1000
        console.log('Answer is emitting to Server', playerResult.points)
        socket.emit('answer', playerResult)
        return
    }
    else if(song_name_correct || artist_name_correct){
        playerResult.points = 500
        console.log('Answer is emitting to Server', playerResult.points)
        socket.emit('answer', playerResult)
        return
    }
    else{
        playerResult.points = 0
        console.log('Answer is emitting to Server', playerResult.points)
        socket.emit('answer', playerResult) 
    }
}