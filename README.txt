// app.get('/set-cookies', (req, res) => {
//   /* 
//     Alternative way: res.setHeader('Set-Cookie', 'newUser = true')
//     httpOnly: true allows us not access the cookie in the terminal using JS
//     secure: true allows the cookie to only be sent or used over a secure https connection
//   */
//   res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true })
//   res.cookie('isEmployee', true)

//   res.send("You got the cookies")
// })
// app.get('/read-cookies', (req, res) => {
  
//   const cookies = req.cookies
//   console.log(cookies)

//   res.json(cookies)
// })
