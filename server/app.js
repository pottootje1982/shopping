const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const recipesRouter = require('./routes/recipes')
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')

const app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(logger('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/client/public')))

// nb: cors settings must be included before other routes

const cors = require('cors')
app.use(cors())

app.use('/recipes', recipesRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

module.exports = app

// start listening
const port = process.env.PORT || 5000
app.set('trust proxy', '127.0.0.1')
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
