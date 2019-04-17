const express = require("express")
const app = express()
const port = 3000
const oauth = require("./oauth")
app
    .use(oauth)
    .use(express.static("static"))
    .listen(port, ()=>console.log(`Server is listening to port ${port}`))