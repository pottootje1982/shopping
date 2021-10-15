const axios = require('axios')

async function getUser(token) {
  if (token) {
    const { data: { email } = {} } = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
      )
      .catch(() => ({}))
    return email
  }
}

module.exports = getUser
