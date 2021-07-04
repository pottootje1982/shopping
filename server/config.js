const dotenv = require("dotenv")
dotenv.config()

const { USE_MEMORY_DB, AH_API, ...env } = process.env

module.exports = {
  USE_MEMORY_DB: USE_MEMORY_DB === "true",
  AH_API: AH_API || "ah-api",
  PAPRIKA_API: USE_MEMORY_DB ? "../scripts/paprika.stub" : "../scripts/paprika",
  ...env,
}
