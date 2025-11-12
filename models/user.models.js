const mongoose = require('mongoose')

const userProp = new mongoose.Schema({
     firstName: {
          type: String, required: true,
          match: [/^[A-Za-z]+$/, "First name must contain only letters"],
          trim: true,
     },
     lastName: {
          type: String, required: true,
          match: [/^[A-Za-z]+$/, "Last name must contain only letters"],
          trim: true,
     },
     email: {
          type: String, required: true,
          unique: [true, "Email has been taken, please choose another one"],
          match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
     },
     password: { type: String, required: true }
})
// const userModel = mongoose.model('users', userProp)

module.exports = mongoose.model('User', userProp)