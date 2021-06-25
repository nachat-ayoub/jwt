const User = require("./models/user");
const Post = require("./models/post");
const mongoose = require('mongoose');



const all_posts = (req, res) => {
  Post.find().sort({date:-1})
    .then(Posts => res.render('posts', {Posts:Posts}) )
    .catch(err => {
        console.log(err)
        res.redirect('/') 
    })
}


const one_post = (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.render('post', {post:post} ))
    .catch(err => {
        console.log(err)
        res.redirect('/') 
    })
}


const createPost = (req, res) => {
  res.render('addPost')
}

module.exports = { all_posts, one_post, createPost };
