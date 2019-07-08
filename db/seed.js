const {
	User,
	Post,
	PostLike,
	Comment,
	CommentLike,
	Follower
} = require('./models')

const main = async () => {
	await User.destroy({ where: {} })
	await Post.destroy({ where: {} })
	await PostLike.destroy({ where: {} })
	await Comment.destroy({ where: {} })
	await CommentLike.destroy({ where: {} })

	// Seed Data
	const user = await User.create({
		firstName: 'John',
		lastName: 'Smith',
		username: 'tester',
		email: 'tester@mail.com',
		password: '1234',
		skills: ['React', 'Python', 'Mongo']
	})

	const user1 = await User.create({
		firstName: 'Jane',
		lastName: 'Doe',
		username: 'test',
		email: 'test@mail.com',
		password: '1234',
		skills: ['HTML', 'Css', 'React']
	})
	const user2 = await User.create({
		firstName: 'Jackie',
		lastName: 'Legs',
		username: 'test3',
		email: 'test3@mail.com',
		password: '1234',
		skills: ['HTML', 'Css']
	})

	const post = await Post.create({
		title: 'Test 1',
		description: 'testing 1 post'
	})

	const likePost = await PostLike.create({
		likes: 10
	})

	const comment = await Comment.create({
		title: 'Cool Post'
	})

	const likeComment = await CommentLike.create({
		likes: 4
	})

	await user.addPost(post)
	await user.addComment(comment)
	await user.addCommentLike(likeComment)
	await user.addPostLike(likePost)

	// await post.addUser(user)
	await post.addPostLike(likePost)
	await post.addComment(comment)

	// await comment.addUser(user)
	await comment.addCommentLike(likeComment)
}
async function run() {
	try {
		await main()
	} catch (e) {
		console.error(e)
	} finally {
		await process.exit()
	}
}

run()
