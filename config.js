const dotenv = require("dotenv")
dotenv.config()

const {
  PAPRIKA_USER,
  PAPRIKA_PASS,
  AH_USER,
  AH_PASS,
  GOOGLE_API_KEY,
  DB_CONNECTION_STRING,
  USE_MEMORY_DB,
} = process.env

module.exports = {
  paprikaUser: PAPRIKA_USER,
  paprikaPass: PAPRIKA_PASS,
  ahUser: AH_USER,
  ahPass: AH_PASS,
  googleApiKey: GOOGLE_API_KEY,
  dbConnectionString: DB_CONNECTION_STRING,
  dbConnector: USE_MEMORY_DB === "true" ? "./memory-db" : "./mongo-client",
  useMemoryDb: USE_MEMORY_DB === "true",
}
