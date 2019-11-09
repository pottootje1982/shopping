var express = require("express")
var router = express.Router()
const path = require("path")

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"))
})

module.exports = router
