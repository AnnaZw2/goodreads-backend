const express = require('express')
const app = express()
const cors = require('cors') 
const myjson = require("./data/data.json")


app.use(cors())
app.get('/', (req, res) => {
    console.log("here")
    res.send(myjson)

})
app.listen(3000)