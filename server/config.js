const dotenv = require('dotenv')
dotenv.config()

const {
  USE_MEMORY_DB,
  USE_PAPRIKA_STUB,
  AH_API,
  PUBLIC_KEY,
  INIT_VECTOR,
  ...env
} = process.env

module.exports = {
  ...env,
  USE_MEMORY_DB: USE_MEMORY_DB === 'true',
  AH_API: AH_API || 'ah',
  PUBLIC_KEY: Buffer.from(PUBLIC_KEY, 'utf8'),
  INIT_VECTOR: Buffer.from(INIT_VECTOR, 'utf8'),
  PAPRIKA_API:
    USE_MEMORY_DB || USE_PAPRIKA_STUB
      ? '../scripts/paprika.stub'
      : '../scripts/paprika'
}
