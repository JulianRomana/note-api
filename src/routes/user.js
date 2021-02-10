const bcrypt = require('bcrypt')
const mysql = require('mysql')
const express = require('express')
const generateToken = require('../lib/create-token')
const router = express.Router()

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
      res.json({ status: 500, message: err })
      console.error(err)
      return
    }

    res.json({
      status: 201, 
      message: "User created",
      data: { token },
    })
  })
})

module.exports = router