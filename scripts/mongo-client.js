const { dbConnectionString } = require("../config")
const MongoWrapper = require("./mongo-wrapper")

const { MongoClient } = require("mongodb")

let db

async function createDb() {
  if (db) return db
  const client = await MongoClient.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch(err => {
    console.log(err)
  })

  if (!client) {
    return
  }

  try {
    db = new MongoWrapper(client)
    return db
  } catch (err) {
    console.log(err)
  }
}

module.exports = createDb
