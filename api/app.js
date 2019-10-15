var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// nb: cors settings must be included before other routes

var cors = require('cors')
app.use(cors())

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app

// start listening
const port = process.env.PORT || 4000
app.set('trust proxy', '127.0.0.1')
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
