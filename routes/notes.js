const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { parsed: env } = require('dotenv').config()
const { host, password, user, database } = env
const db = mysql.createConnection({ host, password, user, database })

router.get('/list', function(req, res) {
  const sql = `SELECT * FROM Note`;
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "User lists retrieved successfully"
    })
  })
});

router.post('/new', function(req, res) {
  const query = `INSERT INTO Note(title, content) VALUES (?)`;
  const values = [
    req.body.title,
    req.body.content
  ];

  db.query(query, [values], function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New user added successfully"
    })
  })
});

module.exports = router;