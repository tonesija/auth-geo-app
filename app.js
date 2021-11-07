const express = require('express')
const { auth } = require('express-openid-connect')
require('dotenv').config()
const { addUserToLastFiveList, getLastFiveUsers } = require("./data")

const PORT = process.env.PORT || 3000


const authConfig = {
  authRequired: false,
  idpLogout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
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
app.use(express.json());

app.get('/', (req, res) => {
  req.user = {
    isAuthenticated : req.oidc.isAuthenticated()
  }
  if (req.user.isAuthenticated) {
    req.user.name = req.oidc.user.name

    res.render('index', {user: req.user, lastFive: getLastFiveUsers(), mapApiKey: process.env.MAP_API_KEY})
  } else {
    res.render('index', {user: req.user, lastFive: [], mapApiKey: process.env.MAP_API_KEY})
  }
})

app.post('/set-location', (req, res) => {
  req.user = {
    isAuthenticated : req.oidc.isAuthenticated()
  }
  if (req.user.isAuthenticated) {
    req.user.name = req.oidc.user.name
    req.user.longitude = req.body.longitude
    req.user.latitude = req.body.latitude
    addUserToLastFiveList(req.user)
  }
  res.send({'msg': "Success!"})
})


app.listen(PORT, () => {
  console.log(`App started on port ${PORT}.`)
})