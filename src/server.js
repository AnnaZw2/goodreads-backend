require('dotenv-defaults').config()

const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const Keycloak = require('keycloak-connect');
const session = require('express-session');


let memoryStore = new session.MemoryStore();


mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Mongo database: "+process.env.DATABASE_URL))

// const keycloak = new Keycloak({ store: memoryStore }, {
//     realm: 'goodreads',
//     clientId: 'myclient',
//     serverUrl: 'http://0.0.0.0:8080/',
//     credentials: {
//       secret: process.env.JWT_SECRET
//     }
//   });



// console.log("Keycloak config: "+JSON.stringify(keycloak.getConfig()))
// console.log("keycloak protected: "+keycloak.protect())
// app.use(session({
//     secret:  process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore
//   }));
  
app.use(cors())
app.use(express.json());
app.use(cookieParser());

const booksRouter= require('./routes/books')
app.use('/books',booksRouter)

const shelvesRouter= require('./routes/shelves')
app.use('/shelves',shelvesRouter)

const commentsRouter= require('./routes/comments')
app.use('/comments',commentsRouter)

const bookDetailsRouter= require('./routes/book-details')
app.use('/book-details',bookDetailsRouter)

const statsRouter= require('./routes/stats')
app.use('/stats',statsRouter)

const authRouter= require('./routes/auth')
app.use('/auth',authRouter)

const userRouter= require('./routes/users')
app.use('/users',userRouter)

const dbsRouter= require('./routes/dbs')
app.use('/dbs',dbsRouter)

// MQTT actions
// update blocked comments
const mqttClient = require('./mqtt-comments')

app.listen(process.env.PORT, () => console.log("Server started on port :"+process.env.PORT))

// module.exports = { keycloak };
