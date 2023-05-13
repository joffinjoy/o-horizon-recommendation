'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const generateProjection = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            CALL gds.graph.project(
                'collabGraph',
                ['User','Item'],
                {
                  RATED: {
                    orientation: 'UNDIRECTED',
                    properties: 'rating'
                  }
                }
            )
            `
		)
	} catch (err) {
		console.log('CollaborativeFilteringQueries.generateProjection: ', err)
		throw err
	} finally {
		session.close()
	}
}

const runFRP = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            CALL gds.fastRP.mutate('collabGraph', {
                embeddingDimension: 16,
                randomSeed: 42,
                mutateProperty: 'embedding',
                relationshipWeightProperty: 'rating',
                iterationWeights: [0.8, 1, 1, 1]
            })
            `
		)
	} catch (err) {
		console.log('CollaborativeFilteringQueries.runFRP: ', err)
		throw err
	} finally {
		session.close()
	}
}

const runKNN = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            CALL gds.knn.write('collabGraph', {
                topK: 9,
                nodeProperties: ['embedding'],
                randomSeed: 42,
                concurrency: 1,
                sampleRate: 1.0,
                deltaThreshold: 0.0,
                writeRelationshipType: "COLLAB_SIMILAR",
                writeProperty: "score"
            })
            `
		)
	} catch (err) {
		console.log('CollaborativeFilteringQueries.runKNN: ', err)
		throw err
	} finally {
		session.close()
	}
}

const findSimilarUsers = async (userId) => {
	const session = neo4jDriver.session()
	try {
		const readQuery = `
            MATCH (n:User{userId: $userId})-[r:COLLAB_SIMILAR]->(m:User) 
            RETURN 
                n.userId as User1, 
                m.userId as User2, 
                r.score as similarity 
            ORDER BY similarity DESCENDING, User1, User2`
		const readResult = await session.executeRead((tx) => tx.run(readQuery, { userId }))
		return readResult
	} catch (err) {
		console.log('CollaborativeFilteringQueries.findSimilarUsers: ', err)
		throw err
	} finally {
		session.close()
	}
}

const getRecommendedItems = async (similarUserId, userId) => {
	const session = neo4jDriver.session()
	try {
		const readQuery = `
            MATCH (:User {userId: $userId})-->(p1:Item)
            WITH collect(p1) as items
            MATCH (:User {userId: $similarUserId})-->(p2:Item)
            WHERE not p2 in items
            RETURN p2.itemId as itemId, p2.title as title`
		const readResult = await session.executeRead((tx) => tx.run(readQuery, { similarUserId, userId }))
		return readResult
	} catch (err) {
		console.log('CollaborativeFilteringQueries.getRecommendedItems: ', err)
		throw err
	} finally {
		session.close()
	}
}

const deleteProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            CALL gds.graph.exists($projectionName) 
            YIELD exists
            `,
			{ projectionName: 'collabGraph' }
		)
		console.log(result.records[0].get('exists'), typeof result.records[0].get('exists'))
		if (result.records[0].get('exists')) await session.run("CALL gds.graph.drop('collabGraph')")
	} catch (err) {
		console.log('CollaborativeFilteringQueries.deleteProjection: ', err)
		throw err
	} finally {
		session.close()
	}
}

const deleteCollabSimilarRelationships = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            match ()-[n:COLLAB_SIMILAR]-() 
            DELETE n
            `
		)
	} catch (err) {
		console.log('CollaborativeFilteringQueries.deleteCollabSimilarRelationships: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.collaborativeFilteringQueries = {
	generateProjection,
	runFRP,
	runKNN,
	findSimilarUsers,
	getRecommendedItems,
	deleteProjection,
	deleteCollabSimilarRelationships,
}
