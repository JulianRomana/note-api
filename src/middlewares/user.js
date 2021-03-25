const isUserExisting = (db) => {
  return (req, res, next) => {
    const { email } = req.body

    db.query({
      sql: 'SELECT email FROM user WHERE email = ?',
      values: [email]
    },
      (error, results) => {
        const exists = Boolean(results.length)
        if (error || !exists) {
          res.status(404).json({ status: 404, message: error || 'User does not exists' })
          return
        }

        next()
    })
  }  
}

const retrievePassword = ({ db, email }) => {
  return new Promise((resolve, reject) => {
    db.query({
      sql: 'SELECT * FROM user WHERE email = ?',
      values: [email]
    },
      (error, [{ password }]) => {
        if (error) {
          reject(error)
          return
        }
        resolve(password)
    })
  })
}

module.exports = {
  isUserExisting,
  retrievePassword,
}