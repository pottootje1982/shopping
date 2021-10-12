process.env.USE_MEMORY_DB = false
process.env.PUBLIC_KEY = 'TEST'
process.env.INIT_VECTOR = 'TEST'

module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFiles: ['<rootDir>/server/.jest/jest-mongodb-config.js'],
  setupFilesAfterEnv: ['<rootDir>/server/.jest/create-test-db.js'],
  maxWorkers: 1
}
