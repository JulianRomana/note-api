const bcrypt = require('bcrypt')
const mysql = require('mysql')
const express = require('express')
const generateToken = require('../lib/create-token')
const { isUserExisting, retrievePassword } = require('../middlewares/user')
const jwt = require('jsonwebtoken')
const router = express.Router()

const {
  HOST: host,
  PASSWORD: password,
  USER: user,
  DATABASE: database,
  TOKEN_SECRET
} = require('dotenv').config().parsed

const db = mysql.createConnection({ host, password, user, database })


router.post('/', async (req, res) => {
  const { email, username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const token = generateToken(email)

  db.query({
    sql: 'INSERT INTO User(email, username, password) VALUES (?)',
    values: [[email, username, hashedPassword]],
  }, err => {
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

router.post('/login', isUserExisting(db), async (req, res) => {
  const { email, password } = req.body

  try {
    const hashedPassword = await retrievePassword({ db, email })

    bcrypt.compare(password, hashedPassword)
      .then((isValid) => {
        if (!isValid) {
          throw new Error('Wrong password')
        }

        res.status(200).json({ status: 200, message: 'Logged in', data: { token: generateToken(email) } })
      })
      .catch(({ message }) => {
        res.status(401).json({ status: 401, message })
      })
    } catch(err) {
      res.status(404).json({ status: 404, message: 'User does not exists' })
  }
})

router.post('/token-check', (req, res) => {
  const { authorization } = req.headers
  const [_, token] = authorization.split(' ')
  if (token === 'null') return res.status(401).json({ status: 401, message: 'Token missing!' })

  const isValid = jwt.verify(token, TOKEN_SECRET, (err) => (err && false) ?? true )

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