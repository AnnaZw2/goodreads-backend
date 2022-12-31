require('dotenv').config()

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



app.use(cors())
app.use(express.json());

const booksRouter= require('./routes/books')
app.use('/books',booksRouter)

const shelvesRouter= require('./routes/shelves')
app.use('/shelves',shelvesRouter)

const dbsRouter= require('./routes/dbs')
app.use('/dbs',dbsRouter)

app.listen(3000, () => console.log("Server started on port :3000"))