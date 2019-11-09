import React from "react"
import axios from "axios"
axios.defaults.baseURL = React.isDevelopment
  ? "http://localhost:5000"
  : "https://gogetmeals.herokuapp.com"
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"
axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"
export default axios
