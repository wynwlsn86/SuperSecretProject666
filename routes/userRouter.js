const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const { User, Follower } = require('../database/models')

userRouter.get('/', async (req, res) => {
	try {
		const users = await User.findAll()
		res.send(users)
	} catch (error) {
		throw error
	}
})
// consolidated user posts and followers into one route
userRouter.get('/:id', async (req, res) => {
	try {
		const users = await User.findByPk(req.params.id, {
			include: [
				{
					model: Post
				},
				{
					model: Follower,
					as: 'followers',
					include: [
						{
							model: User,
							as: 'user'
						}
					]
				}
			]
		})
		res.send(users)
	} catch (error) {}
})

// verify username is not taken already for signup

userRouter.get('/verify/username', async (req, res, next) => {
	try {
		const users = await User.findAll()
		const usernames = []
		if (users) {
			for (let i = 0; i < users.length; i++) {
				usernames.push(users[i].username.toLowerCase())
			}
		}
		res.send(usernames)
	} catch (error) {
		throw error
	}
})

// verify email is not taken when signing up
userRouter.get('/verify/email', async (req, res, next) => {
	try {
		const users = await User.findAll()
		const emails = []
		if (users) {
			for (let i = 0; i < users.length; i++) {
				emails.push(users[i].email.toLowerCase())
			}
		}
		res.send(emails)
	} catch (error) {
		throw error
	}
})

// follow a user, takes current logged in user as user_id and user that is getting followed
// as follower_id, findorcreate checks if record is found, if not then record is created.
userRouter.post('/:user_id/follow/:follower_id', async (req, res) => {
	try {
		const user = await User.findByPk(req.params.user_id)
		if (user) {
			if (user.id.toString() === req.params.follower_id) {
				res.status(400).json({ err: 'You cannot follow yourself' })
			} else {
				const following = await Follower.findOrCreate({
					where: {
						userId: req.params.user_id,
						follower_id: req.params.follower_id
					}
				})
				res.send(following)
			}
		}
	} catch (error) {
		throw error
	}
})

// Does this route make sense as a search route, take in a skill
userRouter.get('/search/skills', async (req, res) => {
	try {
		const findUser = await User.findAll()
		let userArr = []
		if (findUser) {
			for (let i = 0; i < findUser.length; i++) {
				for (let j = 0; j < findUser[i].skills.length; j++) {
					if (
						findUser[i].skills[j]
							.toLowerCase()
							.includes(req.body.skills.toLowerCase())
					) {
						userArr.push(findUser[i])
					}
				}
			}
		}
		res.send(userArr)
	} catch (error) {
		throw error
	}
})
// returns suggest users to follow based on common skills
userRouter.get('/:id/suggested', async (req, res) => {
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
// update user credentials and password
userRouter.put('/:id/update', async (req, res) => {
	try {
		const user = await User.findByPk(req.params.id)
		await User.beforeUpdate(bcrypt.hash(req.body.password, 12))
		if (user) {
			const pass = await bcrypt.hash(req.body.password, 12)
			await User.update(
				{
					username: req.body.username,
					email: req.body.email,
					password: pass
				},
				{
					where: { id: req.params.id }
				}
			)
		}
		res.json({ user: user })
	} catch (error) {
		res.status(error.status || 400)
		res.send({ msg: error })
		throw error
	}
})

module.exports = userRouter
