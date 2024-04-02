const User = require("../models/User")
const jwt = require('jsonwebtoken')

// @HANDLING ERRORS

const handleError = (err) => {
console.log(err.message, err.code)

let errors = { email: '', password: ''}

//duplicate error codes
if(err.code === 11000) {
  errors.email = 'This email is already registered!'
  return errors
}

// Incorrect credintials
if(err.message === 'Incorrect email!') {
  errors.email = 'Email not registered'
}

if(err.message === 'Incorrect password!') {
  errors.password = 'Incorrect password, Try again!'
}

//validation of errors
if(err.message.includes('user validation failed')) {
  Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties)
      errors[properties.path] = properties.message
  })
}

return errors
}

// Creating a function that creates jwt

maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
// The first arg is a payload, then a secret
return jwt.sign({ id }, 'elise secret', {
  expiresIn: maxAge
})
}

module.exports.signup_get = (req, res) => {
res.render('signup')
}

module.exports.login_get = (req, res) => {
res.render('login')
}

// @POST CONTROLLERS

module.exports.signup_post = async(req, res) => {
const { email, password } = req.body

try {
  const user = await User.create({
      email,
      password
  })
  const token = createToken(user._id)
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

  res.status(201).json({ user: user._id })

} catch (err) {
  const errors = handleError(err)
  res.status(400).json({ errors })
}
}


module.exports.login_post = async(req, res) => {
const { email, password } = req.body
try {

  const user = await User.login(email, password)
  const token = createToken(user._id)
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
  res.status(200).json({ user: user._id })

} catch (err) {
  const errors = handleError(err)
  res.status(400).json({ errors })
}
}


// @Logging out users
module.exports.logout_get = (req, res) => {
res.cookie('jwt', '', { maxAge: 1 })
res.redirect('/')
}