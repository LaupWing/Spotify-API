const fetch = require('node-fetch')
let randomNumbersArray = []

function getData(settings){
    return fetch(`https://api.spotify.com/v1/${settings.endpoint}`, 
    {
        headers:
        {
        'Authorization': 'Bearer ' + settings.acces_token
        }
    })
        .then(response=> response.json())
        .then(data=>data[settings.output])
}

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
        for(let i=0;i<randomNumbersArray.length;i++){
            number = randomNumber(array)
            if(randomNumbersArray.indexOf(number) === -1){
                randomNumbersArray.push(number)
                break
            }
            else {
                i--
            }
        }
    }
    if(randomNumbersArray.length === array.length) randomNumbersArray = []
    console.log(randomNumbersArray)
    return array[number]
}

function randomNumber(array){
    return Math.floor(Math.random()*array.length)
}

function trimSong(song){
	const index = song.indexOf('(')
	return song.slice(0,index).trim()
}
module.exports = {getData, trimSong, getRandom, onlyUnique}