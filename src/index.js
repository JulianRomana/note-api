const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const jwksRsa = require('jwks-rsa')
// api Extra security and features
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

const noteRouter = require('./routes/note')
const userRouter = require('./routes/user')
const { parsed: env } = require('dotenv').config()
const { PORT } = env

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname,'views') + '/index.html') })

app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
// app.use(checkJwt)
app.use(morgan('combined'))

app.use('/note', noteRouter)
app.use('/user', userRouter)


app.listen(PORT, () => console.log(`Server started, listening port: http://localhost:${PORT}`))
