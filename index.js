const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const ejs = require('ejs')
app.set('view engine', 'ejs')

const mongoose = require('mongoose')
// const URI = 'mongodb+srv://THEGREATMANNEW:THEGREATMAN7@cluster0.70la8ss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const dotenv = require('dotenv')
dotenv.config()
const URI = process.env.mongodb_URI

mongoose.connect(URI)
    .then(() => {
        console.log('✅ Database connected Successfully')
    }).catch((err) => {
        console.log('Database not connected Successfully' + err)
    })


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        match: [/^[A-Za-z]+$/, 'first name must contain only letters'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        match: [/^[A-Za-z]+$/, 'first name must contain only letters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already in used, please use another one'],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'first name must contain only letters'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        unique: [true, 'Email is already in used, please use another one'],
        match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain atleast 8 characters long, contain uppercase, Lowercase, a number and a special character'],
        trim: true,
    },
})

let user = mongoose.model('User', userSchema)


app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    let newUser = new user(req.body);
    newUser.save()
        .then(() => {
            console.log('User Resgister Successfully' + newUser)
            res.redirect('/signin')
        })
        .catch((err) => {
            console.log("Error regisrting user: ", err);
            res.status(500).send("Internal server Error")
        })
})


// app.get('/', (req, res)=>{
//     res.send('App is now displaying')
// })

// app.get('/page' , (req , res)=>{
//    res.sendFile(__dirname + '\/\index.html')
// })

// app.get('/signin', (req, res) =>{
//     res.render('signin', { message: 'It is working' })
// })

// app.get('/musicAPI', (req, res) =>{
//     res.send(allStudent)
// })

app.get("/", (req, res) => {
    res.render("signup")

})

app.get("/signin", (req, res) => {
    res.render("signin")

})

app.get("/dashboard", (req, res) => {
    res.render("dashboard")

})

app.get('/hopepage', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// app.get('/', (req, res) =>{
//     res.send(array)
// })



app.listen(port, (err) => {
    if (err) {
        console.log('Failed to load server' + err)
    } else {
        console.log('🚀 Server is running at port ' + port)
    }
})