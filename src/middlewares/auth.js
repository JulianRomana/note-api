const { parsed: { TOKEN_SECRET } } = require('dotenv').config()
const jwt = require('jsonwebtoken')


const isUserAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers
  const [_, token] = authorization.split(' ')
  if (token === 'null') return res.status(401).json({ status: 401, message: 'Requires login!' })

  const isValid = jwt.verify(token, TOKEN_SECRET, (err, decoded) => (err && false) ?? true )
  if(!isValid) return res.status(401).json({ status: 401, message: 'Token invalid!' })

  next()
}

module.exports = isUserAuthenticated