const dotenv = require('dotenv')
dotenv.config()

let {
  USE_PAPRIKA_STUB,
  AH_API,
  PUBLIC_KEY,
  INIT_VECTOR,
  MONGO_URL,
  USE_TEST_DB,
  TEST_DB_URL,
  USE_GOOGLE_AUTH_STUB,
  ...env
} = process.env

if (USE_TEST_DB && !TEST_DB_URL) throw 'Please define TEST_DB_URL'

USE_PAPRIKA_STUB = /^true$/i.test(USE_PAPRIKA_STUB)
USE_TEST_DB = /^true$/i.test(USE_TEST_DB)
USE_GOOGLE_AUTH_STUB = /^true$/i.test(USE_GOOGLE_AUTH_STUB)

module.exports = {
  ...env,
  AH_API: AH_API || 'ah',
  PUBLIC_KEY: Buffer.from(PUBLIC_KEY, 'utf8'),
  INIT_VECTOR: Buffer.from(INIT_VECTOR, 'utf8'),
  MONGO_URL: USE_TEST_DB ? TEST_DB_URL : MONGO_URL,
  GOOGLE_AUTH: USE_GOOGLE_AUTH_STUB ? './google-auth.stub' : './google-auth',
  PAPRIKA_API: USE_PAPRIKA_STUB
    ? '../scripts/paprika.stub'
    : '../scripts/paprika'
}
