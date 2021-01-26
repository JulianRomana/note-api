const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const { parsed: env } = require('dotenv').config()
const notesRouter = require('./routes/notes')

app.use(cors())
app.use(bodyParser.json());
app.use('/notes', notesRouter);

app.listen(env.PORT, () => console.log(
  `Server started, listening port: http://localhost:${env.PORT}`
))

app.get('/', function(req, res) {
  res.sendFile(path.resolve(__dirname,'views') + '/index.html');
})

