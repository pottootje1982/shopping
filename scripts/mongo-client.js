const { dbConnectionString } = require("../config")

const MongoClient = require("mongodb").MongoClient

const url = dbConnectionString
let db

async function createDb() {
  if (db) return db
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true
  }).catch(err => {
    console.log(err)
  })

  if (!client) {
    return
  }

  try {
    db = client.db()
    return db
  } catch (err) {
    console.log(err)
  }
}

module.exports = createDb
