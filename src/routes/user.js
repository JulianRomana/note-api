const bcrypt = require('bcrypt')
const mysql = require('mysql')
const express = require('express')
const generateToken = require('../lib/create-token')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { parsed: { TOKEN_SECRET } } = require('dotenv').config()

const { parsed: env } = require('dotenv').config()
const { HOST: host, PASSWORD: password, USER: user, DATABASE: database } = env

const db = mysql.createConnection({ host, password, user, database })


router.post('/', async (req, res) => {
  const { email, username, password } = req.body
  const query = `INSERT INTO User(email, username, password) VALUES (?)`
  const hashedPassword = await bcrypt.hash(password, 10)
  const token = generateToken(username)

  db.query(query, [[email, username, hashedPassword]], err => {
    if (err) {
      res.status(500).json({ status: 500, message: err })
      return
    }

    res.json({
      status: 201, 
      message: "User created",
      data: { token },
    })
  })
})

router.post('/token-check', (req, res) => {
  const { authorization } = req.headers
  const [_, token] = authorization.split(' ')
  if (token === 'null') return res.status(401).json({ status: 401, message: 'Token missing!' })

  const isValid = jwt.verify(token, env.TOKEN_SECRET, (err) => (err && false) ?? true )

  if (isValid) return res.status(201)
    .json({
      status: 201,
      isValid: true,
    })

  return res
    .json({
      status: 401,
      message: 'Token invalid!',
      isValid: false,
    })
})

module.exports = router