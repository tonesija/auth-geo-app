const express = require('express')
const { auth, requiresAuth } = require('express-openid-connect')
require('dotenv').config()

const PORT = process.env.PORT || 3000

const authConfig = {
  authRequired: false,
  idpLogout: true,
  secret: process.env.SECRET,
  baseURL: `http://localhost:${PORT}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: 'https://dev-acy-e9kd.us.auth0.com',
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
  },
}

const app = express()

app.use(auth(authConfig))


app.get('/', (req, res) => {
  console.log(req.oidc.user)
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
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