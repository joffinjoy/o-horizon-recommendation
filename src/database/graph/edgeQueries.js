'use strict'
const { neo4jDriver } = require('@configs/neo4j')
const neo4j = require('neo4j-driver')

const createItemMentorProviderEdges = async (itemId, providerId, mentorId) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MATCH 
                (i:Item {itemId: $itemId}), 
                (p:Provider {providerId: $providerId}), 
                (m:Mentor {mentorId: $mentorId}) 
            MERGE (i)-[c:CONDUCTED_BY]->(m)-[mem:MEMBER_OF]->(p)
            RETURN i,p,m,c,mem`
		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				itemId,
				providerId,
				mentorId,
			})
		)
		return {
			item: writeResult.records[0].get('i'),
			provider: writeResult.records[0].get('p'),
			mentor: writeResult.records[0].get('m'),
			conductedBy: writeResult.records[0].get('c'),
			memberOf: writeResult.records[0].get('mem'),
		}
	} catch (err) {
		console.log('EdgeQueries.createItemMentorProviderEdges: ', err)
		throw err
	} finally {
		session.close()
	}
}

const createBelongsToEdge = async (itemId, categoryId) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MATCH 
                (i:Item {itemId: $itemId}), 
                (c:Category {categoryId: $categoryId}) 
            MERGE(i)-[b:BELONGS_TO]->(c)
            RETURN i,b,c`
		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				itemId,
				categoryId,
			})
		)
		return {
			item: writeResult.records[0].get('i'),
			category: writeResult.records[0].get('c'),
			belongsTo: writeResult.records[0].get('b'),
		}
	} catch (err) {
		console.log('EdgeQueries.createBelongsToEdge: ', err)
		throw err
	} finally {
		session.close()
	}
}

const createIsAboutEdge = async (itemId, topicName) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MATCH (i:Item {itemId: $itemId})
            MERGE (c:Topic {topicName: $topicName})
            MERGE (i)-[is:IS_ABOUT]->(c)
            return i,is,c
        `
		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				itemId,
				topicName,
			})
		)
		return {
			item: writeResult.records[0].get('i'),
			topic: writeResult.records[0].get('c'),
			isAbout: writeResult.records[0].get('is'),
		}
	} catch (err) {
		console.log('EdgeQueries.createIsAboutEdge: ', err)
		throw err
	} finally {
		session.close()
	}
}

const createRatedEdge = async (itemId, userId, rating) => {
	const session = neo4jDriver.session()
	rating = neo4j.int(rating)
	try {
		const writeQuery = `
            MATCH 
                (i:Item {itemId: $itemId}), 
                (u:User {userId: $userId}) 
            MERGE (u)-[r:RATED]->(i) 
            SET r.rating = $rating
            RETURN u,r,i
        `
		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				itemId,
				userId,
				rating,
			})
		)
		return {
			item: writeResult.records[0].get('i'),
			user: writeResult.records[0].get('u'),
			rated: writeResult.records[0].get('r'),
		}
	} catch (err) {
		console.log('EdgeQueries.createRatedEdge: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.edgeQueries = {
	createItemMentorProviderEdges,
	createBelongsToEdge,
	createRatedEdge,
	createIsAboutEdge,
}
