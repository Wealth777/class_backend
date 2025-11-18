const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const ejs = require('ejs')
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors({
     origin: 'https://class-october-frontend.vercel.app',
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     credentials: true
}))

const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()
const URI = process.env.mongodb_URI


mongoose.connect(URI)
     .then(() => {
          console.log('✅ Database connected Successfully')
     }).catch((err) => {
          console.log('Database not connected ' + err)
     })

const User = require('./models/user.models.js')
const usersRoutes = require('./routes/users.routes')

app.use('/user', usersRoutes)

app.listen(port, (err) => {
     if (err) {
          console.log('Failed to load server' + err)
     } else {
          console.log('🚀 Server is running at port ' + port)
     }
})