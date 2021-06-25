const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator')

const UserSchema = new mongoose.Schema({
  'username': {
    type: String,
    required: true,   
    unique: true,
    lowercase: true,
    max: 200,
  },
  'email': {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    max: 200
  },
  'password': {
    type: String,
    required: true,
    min: 6,
    max: 200
  },
  'role': {
    type: String,
    default: 'reader',
  }
})




UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



/*
UserSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  let msg = "The password or the email aren't correct"
  if (user) {
    const isAuth = await bcrypt.compare(password, user.password)
    if (isAuth) {
      const token = createToken(user._id)
      res.cookie("userJWT", token, { httpOnly: true, maxAge: maxAge * 1000 })
      res.redirect('/user')
    }
    else {
      return res.render('login', {msg_err: msg})
    }
  } else {
    return res.render('login', {msg_err: msg})
  }
}

*/



const User = mongoose.model('User', UserSchema)
module.exports = User