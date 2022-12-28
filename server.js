// import myjson from "./data/data.json" assert {type:"json"}
// import express from 'express'
// import cors from 'cors'
const express = require('express')
const app = express()
const cors = require('cors')
const myjson = require("./data/data.json")


app.use(cors())
app.get('/', (req, res) => {
    console.log("here")
    res.json({ msg: "test" })
    // res.json(myjson)

})
app.listen(3000)