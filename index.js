const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const { parsed: env } = require('dotenv').config()
const { host, password, user, database } = env

const mysql = require('mysql')
const db = mysql.createConnection({ host, password, user, database })

app.use(cors())
app.use(bodyParser.json())

app.post('/note', (req, res) => {
  const query = `INSERT INTO Note(title, content) VALUES (?)`;
  const values = [
    req.body.title,
    req.body.content
  ];

  db.query(query, [values], err => {
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 201,
      message: "New note added"
    })
  })
})

app.get('/note', (req, res) => {
  const sql = `SELECT * FROM Note`;
  db.query(sql, (err, data,) => {
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 200,
      data,
      message: "Note list successfully retrieved"
    })
  }) 
})

app.delete('/note/:id', (req, res) => {
  const sql = `DELETE FROM Note WHERE id = ?`;
  const { id } = req.params
  db.query(sql, id,(err, data) => {
    if (err) res.json({ status: 500, message: err })
    res.json({
      status: 200,
      message: "Note successfully deleted"
    })
  })
})

app.listen(env.PORT, () => console.log(
  `Server started, listening port: http://localhost:${env.PORT}`
))

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname,'views') + '/index.html');
})

