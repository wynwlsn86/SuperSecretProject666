const { db } = require('./models')

const resetDb = async () => {
	try {
		await db.sync({ force: true })
		print('Synced')
	} catch (error) {
		print(error)
	} finally {
		await process.exit()
	}
}

resetDb()
