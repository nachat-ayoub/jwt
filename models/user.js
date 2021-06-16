const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
 }
})


UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});




UserSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });

  if (user) {
      const isAuth = await bcrypt.compare(password, user.password)
      if (isAuth) {
        return user;
      }
      else {
        throw error;
      }
  } 
  else {
    throw error;
  }
}









const User = mongoose.model('User', UserSchema);
module.exports = User;