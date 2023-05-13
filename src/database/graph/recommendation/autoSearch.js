'use strict'
const { neo4jDriver } = require('@configs/neo4j')
const neo4j = require('neo4j-driver')

const getImportantTopics = async (skipCount, limit) => {
	const session = neo4jDriver.session()
	try {
		const readQuery = `
            MATCH (t:Topic)
            WHERE t.pageRank IS NOT NULL
            return t.topicName as topic, t.pageRank as pageRank
            ORDER BY t.pageRank DESC
            SKIP $skipCount
            LIMIT $limit`
		const readResult = await session.executeRead((tx) =>
			tx.run(readQuery, { skipCount: neo4j.int(skipCount), limit: neo4j.int(limit) })
		)
		return readResult
	} catch (err) {
		console.log('AutoSearchQueries.getImportantTopics: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.autoSearchQueries = {
	getImportantTopics,
}
