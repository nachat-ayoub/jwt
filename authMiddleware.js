const jwt = require('jsonwebtoken');
const User = require("./models/user");

const checkUser = (req, res, next) => {
  const token = req.cookies.userJWT;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null
        next()
      } else {
       try {
        let user = await User.findById(decodedToken.id)
        res.locals.user = user
        next();
      } catch (err) {
            console.log(err)
            res.locals.user = null
            next()
         }
      }
    })
  } else {
    res.locals.user = null
    next()
  }
};





const requireAuth = (req, res, next) => {
  const token = req.cookies.userJWT;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};


const authPage = (req,res,next) => {
    const token = req.cookies.userJWT;
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
            console.log(err);
            res.redirect('/login')
          } else {
              try {
                let user = await User.findById(decodedToken.id)
                if (user.role == 'admin') {
                  next()
                }
                else throw err /*{res.redirect('/user')}*/
              } catch (err) {
                  console.log(err)
                  res.redirect('/user')
                }
            }
        })
      } else {
          res.redirect('/')
        }
      };











module.exports = { requireAuth, checkUser, authPage };
