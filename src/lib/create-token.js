const { parsed: { TOKEN_SECRET } } = require('dotenv').config()
const jwt = require("jsonwebtoken")

const generateToken = (email) => jwt.sign({ email } , TOKEN_SECRET)

module.exports = generateToken 