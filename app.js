var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var recipesRouter = require("./routes/recipes")
var productsRouter = require("./routes/products")
var ordersRouter = require("./routes/orders")

var app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")))

app.use(logger("dev"))
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "/client/public")))

// nb: cors settings must be included before other routes

var cors = require("cors")
app.use(cors())

app.use("/recipes", recipesRouter)
app.use("/products", productsRouter)
app.use("/orders", ordersRouter)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
})

module.exports = app

// start listening
const port = process.env.PORT || 5000
app.set("trust proxy", "127.0.0.1")
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
