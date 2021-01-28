const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
// api Extra security and features
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

const noteRouter = require('./routes/note')
const createToken = require('./lib/create-token')
const { parsed: env } = require('dotenv').config()
const { HOST, PASSWORD, USER, DATABASE, PORT } = env

app.get('/', (req, res) => { res.sendFile(path.resolve(__dirname,'views') + '/index.html') })

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://<AUTH0_DOMAIN>/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://note-api',
  issuer: `https://julian-romana.auth0.com`,
  algorithms: ['RS256'],
})

app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
// app.use(checkJwt)
app.use(morgan('combined'))

app.use('/note', noteRouter)


app.listen(PORT, () => console.log(`Server started, listening port: http://localhost:${PORT}`))


