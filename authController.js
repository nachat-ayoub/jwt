const User = require("./models/user");
const Post = require("./models/post");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const bcrypt = require('bcrypt');


// Secret 
const jwtSecret = process.env.JWT_SECRET

// create json web token
const maxAge = 5 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({id}, jwtSecret, {
    expiresIn: maxAge
  });
}




module.exports.signup_post = async (req, res) => {

  try{
    const { username, email, password, confirmPassword } = req.body;
    let userEmail = await User.findOne({ email })
    let userUsername = await User.findOne({ username })
    if (userUsername) {
      let data = {
        msg_username: "Sorry that username is taken. Try another.",
        username:username,
        email:email
      }
      res.render('sign-up', data)
    }else if (userEmail) {
      let data = {
        msg_email: "Sorry this email is already been used.",
        username:username,
        email:email
      }
      res.render('sign-up', data)
    }else if (confirmPassword !== password) {
      let data = {
        msg_password: "Those passwords didn’t match. Try again.",
        username:username,
        email:email
      }
      res.render('sign-up', data)
    }else {
      const user = await User.create({username, email, password})
      const token = createToken(user._id);
      res.cookie('userJWT', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.redirect('/user')
    }


  } 
  catch (err) {
	  console.log(err.message)
  }
}

module.exports.login_post = async (req, res) => {
  try{
    const { email, password } = req.body;
    //const user = await User.login(email, password)
    const user = await User.findOne({ email });
    let msg = "The password or the email aren't correct"
    if (user) {
      const isAuth = await bcrypt.compare(password, user.password)
      if (isAuth) {
        const token = createToken(user._id)
        res.cookie("userJWT", token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.redirect('/user')
      } else {
        return res.render('login', {msg_err: msg})
      }
    } else {
        return res.render('login', {msg_err: msg})
    }

  } catch (err) {
	  console.log(err)
  }

}


module.exports.create_post = async (req, res) => {
  const { title, body } = req.body;
  let image = req.file.path
  try{
    const result = await cloudinary.uploader.upload(image);
    const post = await Post.create({title, body, image:result.secure_url, cloudinary_id:result.public_id})
    res.redirect('/posts')
  }
  catch (err) {
    console.log(err)
  }
}

