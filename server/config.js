const dotenv = require('dotenv')
dotenv.config()

const { USE_MEMORY_DB, USE_PAPRIKA_STUB, AH_API, ...env } = process.env

module.exports = {
  USE_MEMORY_DB: USE_MEMORY_DB === 'true',
  AH_API: AH_API || 'ah',
  PAPRIKA_API:
    USE_MEMORY_DB || USE_PAPRIKA_STUB
      ? '../scripts/paprika.stub'
      : '../scripts/paprika',
  ...env
}
