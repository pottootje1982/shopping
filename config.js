const dotenv = require("dotenv")
dotenv.config()
module.exports = {
  paprikaUser: process.env.PAPRIKA_USER,
  paprikaPass: process.env.PAPRIKA_PASS,
  ahUser: process.env.AH_USER,
  ahPass: process.env.AH_PASS,
  googleApiKey: process.env.GOOGLE_API_KEY,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  ahTokenPresumed: process.env.ah_token_presumed,
  ahToken: process.env.ah_token,
  ahPresumedMemberNo: process.env.ahold_presumed_member_no
}
