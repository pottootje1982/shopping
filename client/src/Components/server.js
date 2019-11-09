import axios from "axios"
axios.defaults.baseURL = window.location.href.includes("localhost")
  ? "http://localhost:5000"
  : "https://gogetmeals.herokuapp.com"
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8"
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*"
axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"
export default axios
