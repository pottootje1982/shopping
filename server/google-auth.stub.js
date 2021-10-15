const { FAKE_USER } = require('./config')

async function getUser(token) {
  if (!FAKE_USER) throw 'Please define FAKE_USER'
  return token && FAKE_USER
}

module.exports = getUser
