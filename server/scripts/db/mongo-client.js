const { MONGO_URL } = require('../../config')
const { MongoClient } = require('mongodb')

async function createDb() {
  const client = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch((err) => {
    console.log(err)
  })

  if (!client) {
    return
  }

  try {
    return client
  } catch (err) {
    console.log(err)
  }
}

module.exports = createDb
