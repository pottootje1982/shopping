const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const { GOOGLE_AUTH } = require('./config')

const getUser = require(GOOGLE_AUTH)

const usersRouter = require('./routes/users')
const recipesRouter = require('./routes/recipes')
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')

const app = express()

app.use(async (req, res, next) => {
  const user = await getUser(req.headers.authorization)
  const { supermarket } = req.query
  const { url, method } = req
  if (
    !supermarket &&
    method !== 'DELETE' && method !== 'OPTIONS' &&
    (url.startsWith('/orders') || url.startsWith('/products'))
  )
    return res.status(400).send('Specify supermarket in query')
  if (!user && supermarket === 'ah' && url.startsWith('/products'))
    return next()
  if (!user && url.startsWith('/users')) return res.status(401).send()
  if (!user && url.startsWith('/recipes?') && method === 'GET') return next()
  if (!user && method !== 'OPTIONS' && (url.startsWith('/recipes') || url.startsWith('/orders') || url.startsWith('/products') || url.startsWith('/users'))) return res.status(401).send()
  req.user = user
  next()
})

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
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
