'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const getEmailIds = async () => {
	const session = neo4jDriver.session()
	try {
		const readQuery = 'MATCH (n:User) return n.email, n.userId'
		const readResult = await session.executeRead((tx) => tx.run(readQuery))
		return readResult
	} catch (err) {
		console.log('ReadQueries.getEmailIds: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.readQueries = {
	getEmailIds,
}
