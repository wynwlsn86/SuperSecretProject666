const { Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')

const db = new Sequelize(
	process.env.DATABASE_URL || 'postgres://localhost:5432/hackstagram',
	{
		database: 'hackstagram',
		dialect: 'postgres',
		define: {
			underscored: true
		}
	}
)

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true
	},
	profileImage: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	skills: {
		type: Sequelize.ARRAY(Sequelize.STRING)
	},
	followers: {
		type: Sequelize.ARRAY(Sequelize.INTEGER)
	}
})

User.beforeCreate(async (user, options) => {
	const hashedPassword = await bcrypt.hash(user.password, 12)
	user.password = hashedPassword
})

const Post = db.define('post', {
	title: {
		type: Sequelize.STRING
	},
	image: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.TEXT
	}
})

const PostLike = db.define('postLike', {
	likes: {
		type: Sequelize.INTEGER
	}
})

const Comment = db.define('comment', {
	title: {
		type: Sequelize.STRING
	}
})

const CommentLike = db.define('commentLike', {
	likes: {
		type: Sequelize.INTEGER
	}
})

User.hasMany(Post, { onDelete: 'cascade' })
User.hasMany(PostLike, { onDelete: 'cascade' })
User.hasMany(Comment, { onDelete: 'cascade' })
User.hasMany(CommentLike, { onDelete: 'cascade' })

Post.belongsTo(User)
Post.hasMany(Comment)
Post.hasMany(PostLike)

PostLike.belongsTo(Post)
PostLike.belongsTo(User)

Comment.belongsTo(User)
Comment.belongsTo(Post)
Comment.hasMany(CommentLike)

CommentLike.belongsTo(Comment)
CommentLike.belongsTo(User)

module.exports = {
	User,
	Comment,
	CommentLike,
	Post,
	PostLike,
	db
}
