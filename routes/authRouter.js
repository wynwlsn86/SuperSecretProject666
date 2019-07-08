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

authRouter.get('/users', async (req, res) => {
	try {
		const users = await User.findAll()
		res.send(users)
	} catch (error) {
		throw error
	}
})

authRouter.get('/users/skills', async (req, res) => {
	try {
		const findUser = await User.findAll()
		let userArr = []
		if (findUser) {
			for (let i = 0; i < findUser.length; i++) {
				if (findUser[i].skills.includes(req.body.skills)) {
					arr.push(findUser[i])
				}
			}
		}
		res.send(userArr)
	} catch (error) {
		throw error
	}
})

authRouter.get('/users/:id/trending', async (req, res) => {
	try {
		const findUser = await User.findByPk(req.params.id)
		const findUsers = await User.findAll()
		let users = []
		if (findUser) {
			for (let i = 0; i < findUser.skills.length; i++) {
				if (findUsers) {
					for (let j = 0; j < findUsers.length; j++) {
						if (
							findUsers[j].skills.includes(findUser.skills[i]) &&
							findUsers[j].id !== findUser.id
						) {
							if (!users.includes(findUsers[j])) {
								users.push(findUsers[j])
							}
						}
					}
				}
			}
		}
		res.send(users)
	} catch (error) {
		throw error
	}
})

module.exports = authRouter
