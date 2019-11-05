var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var recipesRouter = require('./routes/recipes')
var productsRouter = require('./routes/products')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// nb: cors settings must be included before other routes

var cors = require('cors')
app.use(cors())

app.use('/recipes', recipesRouter)
app.use('/products', productsRouter)
app.use('/', indexRouter)

module.exports = app

// start listening
const port = process.env.PORT || 4000
app.set('trust proxy', '127.0.0.1')
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
