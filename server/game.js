const express = require("express")
const router = express.Router()
const fetch = require('node-fetch')
router.get("/", (req,res)=>{
    console.log('This is the acces token=',req.session.acces_token)
    const playlist_id = '2f6tXtN0XesjONxicAzMIw'
    console.log(req.session.acces_token)
    fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        headers:{
            'Authorization': 'Bearer ' + req.session.acces_token
        }
    })
    .then(response=> response.json())
    .then(data=>console.log(data))

    res.send("game page")
})

module.exports = router