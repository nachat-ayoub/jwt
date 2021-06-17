const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config()
const User = require("./models/User");
const cookieParser = require('cookie-parser');
const auth = require('./auth.js');
const { requireAuth, checkUser } = require('./authMiddleware');


const app = express()



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());


// Salt
const salt = 12;

// Connecting To DB :
mongoose.connect(process.env.URI_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(response => console.log('db connected successfully...'))
  	.catch(err => console.log(err));



// GET
app.get('*', checkUser);
app.get('/', (req,res) => res.render('index') )
app.get('/login', (req,res) => res.render('login') )
app.get('/sign-up', (req,res) => res.render('sign-up') )
app.get('/user', requireAuth, (req,res) => res.render('user') )
app.get('/logout', (req,res) => {
	res.cookie("userJWT", '', { httpOnly: true, maxAge: 1})
	res.redirect('/')
})


// POST 
app.post('/login', auth.login_post)
app.post('/sign-up', auth.signup_post)




app.get('/user/:id', (req,res) => {
	const id = req.params._id
	User.findById(id)
		.then(data => res.render('dashboard', {data : data}))
		.catch(err => console.log(err))

})
 






PORT = process.env.PORT || 5000
app.listen( PORT , () => console.log(`Server running on port ${PORT}`))