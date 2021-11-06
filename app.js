const express = require('express')
const { auth, requiresAuth } = require('express-openid-connect')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const BASE_URL = process.env.APP_URL || `http://localhost:${PORT}`
console.log(BASE_URL)
const authConfig = {
  authRequired: false,
  idpLogout: true,
  secret: process.env.SECRET,
  baseURL: BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-acy-e9kd.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
  },
}

const app = express()

app.use(express.static('public'));
app.set('view engine', 'pug')

app.use(auth(authConfig))


app.get('/', (req, res) => {
  req.user = {
      isAuthenticated : req.oidc.isAuthenticated()
  };
  if (req.user.isAuthenticated) {
      req.user.name = req.oidc.user.name;
  }

  res.render('index', {user: req.user})
})

app.get('/private', (req, res) => {
  const user = JSON.stringify(req.oidc.user)
  res.send("hello", user)
})

app.get("/sign-up", (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: { screen_hint: "signup" },
  });
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}.`)
})