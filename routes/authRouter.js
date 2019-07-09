const express = require('express')
const authRouter = express.Router()
const { passport, signToken } = require('../auth/auth')
const { User } = require('../db/models')

authRouter.post('/login', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			console.log('*** err', err)
			if (err || !user) {
				const error = new Error('An Error Occurred')
				return next(error)
			}

			req.login(
				user,
				{
					session: false
				},
				async (error) => {
					if (error) return next(error)
					const { username, id } = user
					const payload = { username, id }
					const token = signToken(payload)
					// return the user object
					return res.json({ user, token })
				}
			)
		} catch (error) {
			return next(error)
		}
	})(req, res, next)
})

authRouter.post('/signup', async (req, res, next) => {
	passport.authenticate('signup', async (err, user, info) => {
		try {
			if (!user || err) {
				let err = new Error('***Unable to create account***')
				err.status = 400
				return next(err)
			}
			console.log('looking for user', user)
			if (err || !user) {
				const error = new Error('Unsuccessful')
				return next(error)
			}
			return res.json({ msg: 'user created', user: user })
		} catch (error) {
			return next(error)
		}
	})(req, res, next)
})

module.exports = authRouter
