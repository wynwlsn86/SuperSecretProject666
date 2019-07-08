const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const passport = require('passport')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const auth = require('./auth/auth')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3001

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(logger('dev'))

// Routing
app.use('/auth', auth, authRouter)
app.use('/users', userRouter)
// Initializing passport Auth
app.use(passport.initialize())

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})
