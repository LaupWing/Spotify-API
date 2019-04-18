const express = require("express")
const router = express.Router()

router.get("/", (req,res)=>{
    console.log(req.session.acces_token)
    res.send("game page")
})

module.exports = router