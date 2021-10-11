const Table = require('./table')

const { createCipheriv, createDecipheriv } = require('crypto')
const { PUBLIC_KEY, INIT_VECTOR } = require('../../../config')

class UserDb extends Table {
  constructor(db) {
    super(db, 'users')
    this.db = db
    this.db.defaults({ orders: [] }).write()
  }

  async getUser(mail) {
    if (!mail) return
    const user = await this.db.get('users').find({ mail }).cloneDeep().value()
    let { picnicPass, paprikaPass } = user
    picnicPass = picnicPass && decrypt(picnicPass)
    paprikaPass = paprikaPass && decrypt(paprikaPass)
    return { ...user, picnicPass, paprikaPass }
  }

  storeUser(userMail, user) {
    let { picnicPass, paprikaPass } = user
    picnicPass = picnicPass && encrypt(picnicPass)
    paprikaPass = paprikaPass && encrypt(paprikaPass)
    return this.db
      .get(this.tableName)
      .find({
        mail: userMail
      })
      .upsert({
        mail: userMail,
        ...user,
        picnicPass,
        paprikaPass
      })
      .write()
  }
}

function encrypt(text) {
  if (!text) return text
  var cipher = createCipheriv('aes-256-cbc', PUBLIC_KEY, INIT_VECTOR)
  var crypted = cipher.update(text, 'utf-8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(value) {
  if (!value) return value
  const decipher = createDecipheriv('aes-256-cbc', PUBLIC_KEY, INIT_VECTOR)
  let decryptedData = decipher.update(value, 'hex', 'utf-8')
  decryptedData += decipher.final('utf8')
  return decryptedData
}

module.exports = UserDb
