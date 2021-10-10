const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const axios = require('axios')

const usersRouter = require('./routes/users')
const recipesRouter = require('./routes/recipes')
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')

const app = express()

async function getUser(req) {
  if (req.headers.authorization) {
    try {
      const {
        data: { email }
      } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${req.headers.authorization}`
      )
      return email
    } catch {}
  }
}

app.use(async (req, _res, next) => {
  req.user = await getUser(req)
  next()
})

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')))

app.use(logger('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../client/public')))

// nb: cors settings must be included before other routes

const cors = require('cors')
app.use(cors())

app.use('/users', usersRouter)
app.use('/recipes', recipesRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

module.exports = app

// start listening
const port = process.env.PORT || 5000
app.set('trust proxy', '127.0.0.1')
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
