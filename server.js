require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors');
const app = express()
const mongoose = require('mongoose')

app.use(cors())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const usersRouter = require('./routes/users')
const booksRouter = require('./routes/books')

app.use('/apis/users', usersRouter)
app.use('/apis/books', booksRouter)

// UI
app.get('/', (req, res) => {
    res.sendFile('/index.html')
})

app.listen(3000, () => console.log('Server Started ....'))