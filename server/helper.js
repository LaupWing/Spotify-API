const fetch = require('node-fetch')

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

module.exports = getData