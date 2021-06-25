const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config()
const User = require("./models/user");
const Post = require("./models/post");
const cookieParser = require('cookie-parser');
const authController = require('./authController.js');
const { requireAuth, checkUser, authPage } = require('./authMiddleware');
const { all_posts, one_post, createPost } = require('./authRoute');

const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const methodOverride = require("method-override");





const app = express()



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))



// Salt
const salt = 12;

// Connecting To DB :
mongoose.connect(process.env.URI_DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(response => console.log('db connected successfully...'))
  .catch(err => console.log(err));


// GET
app.get('*', checkUser);
app.get('/', (req,res) => res.render('index') )
app.get('/login', (req,res) => res.render('login') )
app.get('/sign-up', async (req,res) => {
	try{
		//await User.find()
		res.render('sign-up')
	} catch(err) {console.log(err)}
})
app.get('/user', requireAuth, (req,res) => res.render('user') )

app.get('/posts', all_posts)
app.get('/posts/:id', one_post)
// ADMIN PAGE
app.get('/post/create', authPage, createPost)
app.get('/posts/edit/:id', requireAuth, authPage, async (req, res) => {
	try{
		let post = await Post.findById(req.params.id)
		res.render("editPost", {post:post})
	} catch (err) {
		console.log(err);
	  	res.redirect('/posts');
	}
})



// LOG OUT USER
app.get('/logout', (req,res) => {
	res.cookie('userJWT', '', { maxAge: 1 });
  	res.redirect('/');
})


// POST 
app.post('/login', authController.login_post)
app.post('/sign-up', authController.signup_post)
// ADMIN PAGE
app.post('/posts/create', requireAuth, authPage, upload.single("image"), authController.create_post)






// DELETE
app.delete("/posts/delete/:id", requireAuth, authPage, async (req, res) => {
  try {
  	let post = await Post.findById(req.params.id)
	await cloudinary.uploader.destroy(post.cloudinary_id);
    await post.remove();
	res.redirect('/posts')
  } catch (err) {
    console.log(err);
  }
});




// UPDATE
app.put("/posts/edit/:id", requireAuth, authPage, upload.single("image"), async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    console.log(req.file)
    if (req.file) {
      await cloudinary.uploader.destroy(post.cloudinary_id)
      console.log("we are in req.file")
      let result = await cloudinary.uploader.upload(req.file.path)
      const data = {
	    title: req.body.title,
	    body: req.body.body,
	    image: result.secure_url,
	    cloudinary_id: result.public_id
	  }
	  post = await Post.findByIdAndUpdate(req.params.id, data)
    } else {
       console.log("we are not in req.file")
	   const data = {
	     title: req.body.title,
	     body: req.body.body,
	     image: post.image,
	     cloudinary_id: post.cloudinary_id
	   }
	   post = await Post.findByIdAndUpdate(req.params.id, data)
    }
   
   res.redirect(`/posts/${req.params.id}`)
  } catch (err) {
	   console.log(err);
	   res.redirect('/posts')
    }
});












port = process.env.PORT || 5000
app.listen( process.env.PORT || 5000 , () => console.log(`Server running on port `))
