require('dotenv').config('devel.env')

const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')


const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

const books = require("./data/books.json")
const shelves = require("./data/shelves.json")


app.use(cors())
app.use(express.json());

const booksRouter= require('./routes/books')
app.use('/books',booksRouter)

app.get('/shelves', (req, res) => {
    console.log("shelves get handler")
    res.json(shelves)
})
app.post('/shelves', (req, res) => {
    console.log("shelves post handler")
    const id = uuidv4()
    shelves.push({sort: req.body.sort, type: "custom", id: id, name: req.body.name})
    res.json({id: id})
})


app.listen(3000, () => console.log("Server started on port :3000"))