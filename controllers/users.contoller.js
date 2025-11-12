const bcrypt = require("bcrypt");
const saltRounds = 10;

const nodemailer = require('nodemailer')
const pass = process.env.google_password

const User = require('../models/user.models')

const getSignup = (req, res) => {
     res.render("signup")
}

const postRegister = (req, res) => {
     const { firstName, lastName, email, password } = req.body;

     //  const strongPasswordRegex = /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
     //  if (!strongPasswordRegex.test(password)) {
     //       return res.status(400).send(
     //            "password must be at least 8 characters long, contain uppercase, lowercase, a number and a special character"
     //       );
     //  }


     User.findOne({ email })
          .then((existingUser) => {
               if (existingUser) {
                    res.status(400).send("Email already exists");
                    return Promise.reject("User already exists");
               }
               return bcrypt.hash(password, saltRounds);
          })
          .then((hashedPassword) => {
               if (!hashedPassword) return;
               const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
               });
               return newUser.save();
          })
          .then((savedUser) => {
               if (!savedUser) return;
               console.log("User registered successfully");


               let transporter = nodemailer.createTransport({
                    service: 'gmail',

                    auth: {
                         user: 'olujidewealth3@gmail.com',
                         pass
                    }
               });

               let mailOptions = {
                    from: 'olujidewealth3@gmail.com',
                    to: [req.body.email],
                    subject: 'Welcome to Our routerlication',
                    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2563EB, #581C87); padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Welcome to Our routerlication</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 15px; color: #555;">
            Thank you for signing up. We’re glad to have you on board.  
            You can now explore your account and access all features available.
          </p>
          <p style="font-size: 15px; color: #555;">
            Click the button below to get started.
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <a href"http://localhost:3000/signin" 
               style="background: #2563EB; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 15px;">
              Get Started
            </a>
          </div>
          <p style="font-size: 13px; color: #777;">
            If you didn’t create an account, you can ignore this message.
          </p>
        </div>
        <div style="background: #f0f0f0; text-align: center; padding: 10px;">
          <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  `
               }


               transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                         console.log('error sending mail' + error)
                    } else {
                         console.log('Email sent: ' + info.response)
                    }
               })
               console.log(req.body);
               res.redirect("/user/signin");
          })
          .catch((err) => {
               if (err === "User already exists") return;
               console.log("error saving user:", err);
               res.status(500).send("Internal server error");
          });
}

const getSignin = (req, res) => {
     res.render("signin")
}

const postLogin = async (req, res) => {
     const { email, password } = req.body;
     try {
          const user = await User.findOne({ email });
          if (!user) {
               return res.status(400).send("Invalid email or password");
          }

          const match = await bcrypt.compare(password, user.password);
          if (!match) {
               return res.status(400).send("Invalid email or password");
          }

          let transporter = nodemailer.createTransport({
               service: 'gmail',

               auth: {
                    user: 'olujidewealth3@gmail.com',
                    pass
               }
          });

          let mailOptions = {
               from: 'olujidewealth3@gmail.com',
               to: [req.body.email],
               subject: 'Welcome to Our routerlication Again',
               html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2563EB, #581C87); padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Welcome to Our routerlication</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hello, ${req.body.firstName}</p>
          <p style="font-size: 15px; color: #555;">
            Thank you for logging in. We’re glad to have you on board again.  
            Explore more and enjoy our services.
          </p>
          <p style="font-size: 15px; color: #555;">
            Click the button below to continue.
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <a href"http://localhost:3000/dashboard" 
               style="background: #2563EB; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 15px;">
              Explore more
            </a>
          </div>
        </div>
        <div style="background: #f0f0f0; text-align: center; padding: 10px;">
          <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  `
          }

          transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                    console.log(error)
               } else {
                    console.log('Email sent: ' + info.response)
               }
          })
          res.redirect('/user/dashboard');
     } catch (error) {
          console.error('Login error:', error);
          res.status(500).send("Error during login");
     }
}

const getDashboard = (req, res) => {
     res.render("dashboard")
}

module.exports = { getSignup, getSignin, getDashboard, postRegister, postLogin }