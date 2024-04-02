const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  // Check if the web token exist & verified or not
  if (token) {
    jwt.verify(token, process.env.secret, (err, decodedToken) => {
      if (err) {
        console.log(err)
        res.redirect('/login')
      } else {
        // console.log(decodedToken)
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

// Check the current user

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.secret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser }