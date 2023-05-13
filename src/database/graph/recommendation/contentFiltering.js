'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const deleteContentSimilarRelationships = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            MATCH ()-[r:CONTENT_SIMILAR]-()
            DELETE r
            `
		)
	} catch (err) {
		console.log('ContentFilteringQueries.deleteContentSimilarRelationships: ', err)
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
			{ projectionName: 'contentGraph' }
		)
		if (result.records[0].get('exists')) await session.run("CALL gds.graph.drop('contentGraph')")
	} catch (err) {
		console.log('ContentFilteringQueries.deleteProjection: ', err)
		throw err
	} finally {
		session.close()
	}
}

const generateProjection = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            CALL gds.graph.project(
                'contentGraph',
                ['Item','Topic'],
                ['IS_ABOUT']
            )
            `
		)
	} catch (err) {
		console.log('ContentFilteringQueries.generateProjection: ', err)
		throw err
	} finally {
		session.close()
	}
}

const runNodeSimilarity = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`
            CALL gds.nodeSimilarity.write('contentGraph', {
                nodeLabels:['Item','Topic'],
                writeRelationshipType: 'CONTENT_SIMILAR',
                writeProperty: 'score',
                similarityCutoff: 0.4
            })
            `
		)
	} catch (err) {
		console.log('ContentFilteringQueries.runNodeSimilarity: ', err)
		throw err
	} finally {
		session.close()
	}
}

const getSimilarItems = async (itemId) => {
	const session = neo4jDriver.session()
	try {
		const readQuery = `
            MATCH (i:Item {itemId: $itemId})-[r:CONTENT_SIMILAR]-(q:Item)
            WHERE r.score >= 0.5
            RETURN DISTINCT i as selectedItem, q.itemId as itemId, q.title as title
            LIMIT 10`
		const readResult = await session.executeRead((tx) => tx.run(readQuery, { itemId }))
		const recommendedItems = readResult.records.map((record) => {
			return { itemId: record.get('itemId'), title: record.get('title') }
		})
		return recommendedItems
	} catch (err) {
		console.log('ContentFilteringQueries.getSimilarItems: ', err)
		throw err
	} finally {
		session.close()
	}
}

const getProfilePageItems = async (userId) => {
	const session = neo4jDriver.session()
	try {
		const readQuery = `
            MATCH (u:User {userId: $userId})-[r:RATED]->(i:Item)
            WITH i, COLLECT(i) as ratedItems, (r.rating - 1) / 4.0 as normalizedRating
            ORDER BY normalizedRating DESC
            LIMIT 5

            MATCH (i)-[rel:CONTENT_SIMILAR]-(q:Item)
            WHERE NOT q IN ratedItems
            WITH q, rel.score + 1.5*normalizedRating as simScore
            ORDER BY simScore DESC
            WITH DISTINCT q, simScore
            LIMIT 10
            RETURN q.itemId as itemId, q.title as title, simScore as score`
		const readResult = await session.executeRead((tx) => tx.run(readQuery, { userId }))
		const recommendedItems = readResult.records.map((record) => {
			return { itemId: record.get('itemId'), title: record.get('title'), score: record.get('score') }
		})
		return recommendedItems
	} catch (err) {
		console.log('ContentFilteringQueries.getProfilePageItems: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.contentFilteringQueries = {
	generateProjection,
	runNodeSimilarity,
	deleteProjection,
	deleteContentSimilarRelationships,
	getSimilarItems,
	getProfilePageItems,
}
