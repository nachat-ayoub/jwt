const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config()
const User = require("./models/User");
const cookieParser = require('cookie-parser');
const auth = require('./auth.js');
const { requireAuth } = require('./authMiddleware');


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
app.get('/', (req,res) => res.render('index') )
app.get('/login', (req,res) => res.render('login') )
app.get('/sing-up', (req,res) => res.render('sing-up') )
app.get('/user', requireAuth, (req,res) => {
	const tokenID = req.cookies.userID;
	if (!tokenID) {res.redirect('/')}
	const user = User.findById(tokenID)
		.then(data => res.render('user', {data: data}))
		.catch (err => console.log(err) )
	
})


// POST 
app.post('/login', auth.login_post)
app.post('/sing-up', auth.signup_post)




app.get('/user/:id', (req,res) => {
	const id = req.params._id
	User.findById(id)
		.then(data => res.render('dashboard', {data : data}))
		.catch(err => console.log(err))

})
 






PORT = process.env.PORT || 5000
app.listen( PORT , () => console.log(`Server running on port ${PORT}`))