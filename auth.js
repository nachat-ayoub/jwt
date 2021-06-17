const User = require("./models/User");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');




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
  const { email, password } = req.body;

  try{
  	const user = await User.create({email, password})
    const token = createToken(user._id);
    res.cookie('userJWT', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/user')
  } 
  catch (err) {
	console.log(err)
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try{
  	const user = await User.login(email, password)
  	const token = createToken(user._id)
  	res.cookie("userJWT", token, { httpOnly: true, maxAge: maxAge * 1000 })
  	res.redirect('/user')
  } 
  catch (err) {
	console.log(err)
  }

}




