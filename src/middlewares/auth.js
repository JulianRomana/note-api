const { parsed: { TOKEN_SECRET } } = require('dotenv').config()
const jwt = require('jsonwebtoken')


const isUserAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers
  const [_, token] = authorization.split(' ')
  if (token === 'null') return res.json({ status: 401, message: 'Requires login!' })

  const isValid = jwt.verify(token, TOKEN_SECRET).catch(() => false)
  console.log(isValid)
    /* .then(() => { next() })
    .catch(err => res.json({ status: 401, message: 'Token invalid!' })) */
}

module.exports = isUserAuthenticated  