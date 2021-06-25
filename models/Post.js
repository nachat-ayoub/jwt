const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const PostSchema = new mongoose.Schema({
  'title': {
    type: String,
    required: true,
  },
  'image': {
    type: String,
    default: 'https://images.unsplash.com/photo-1586769852388-153870393504',
  },
   'cloudinary_id': {
    type: String,
    required: true
  },
   'date': {
    type: Date,
    default: Date.now
  },
  'body': {
    type: String,
    required: true,
  },
  'tags': [
     {
      type: String,
     }
  ]
})





/*
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

*/





const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
