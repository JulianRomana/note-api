const mysql = require('mysql')
const express = require('express')
const router = express.Router()

const { parsed: env } = require('dotenv').config()
const { HOST: host, PASSWORD: password, USER: user, DATABASE: database } = env

const db = mysql.createConnection({ host, password, user, database })

router.post('/', (req, res) => {
  const query = `INSERT INTO Note(title, content) VALUES (?)`
  const values = [
    req.body.title,
    req.body.content
  ]

  db.query(query, [values], err => {
    if (err) res.json({ status: 500, message: err }) 
    res.json({
      status: 201,
      message: "New note added"
    })
  })
})

router.get('/', (req, res) => {
  const sql = `SELECT * FROM Note`
  db.query(sql, (err, data,) => {
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 200,
      data,
      message: "Note list successfully retrieved"
    })
  }) 
})

router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM Note WHERE id = ?`
  const { id } = req.params

  db.query(sql, id,(err, data) => {
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 200,
      message: "Note successfully deleted"
    })
  })
})

router.put('/:id', (req, res) => {
  const sql = `UPDATE Note SET title = ?, content = ? WHERE id = ?`
  const values = [
    req.body.title,
    req.body.content
  ]
  const { id } = req.params

  db.query(sql, [...values, id],(err, data) => { 
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 200,
      data,
      message: "Note successfully updated"
    })
  })
})

module.exports = router