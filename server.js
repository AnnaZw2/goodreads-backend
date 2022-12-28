const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const books = require("./data/books.json")
const shelves = require("./data/shelves.json")

// shelves.push({sort: 40, type: "custom", id: "ala", name: "Ala"})
// const newShelves = shelves.filter(e=>e.id != "favourite")

app.use(cors())
app.use(bodyParser.json());

app.get('/books', (req, res) => {
    console.log("books handler")
    res.send(books)

})
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

app.listen(3000)