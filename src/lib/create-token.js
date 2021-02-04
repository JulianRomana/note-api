const { parsed: { TOKEN_SECRET } } = require('dotenv').config()
const jwt = require("jsonwebtoken")

const generateToken = username => jwt.sign({ username} , TOKEN_SECRET)

module.exports = generateToken