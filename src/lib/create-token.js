const { parsed: { TOKEN_SECRET } } = require('dotenv').config()
const jwt = require("jsonwebtoken")

const createToken = username => jwt.sign(username, TOKEN_SECRET)

module.exports = createToken