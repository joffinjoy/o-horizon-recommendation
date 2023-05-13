'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const addUser = async (user) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MERGE (n:User {userId: $userId}) 
            SET n.name = $name, 
                n.email = $email, 
                n.phone = $phone 
            RETURN n`

		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				name: user.name,
				email: user.email,
				phone: user.phone,
				userId: user.userId,
			})
		)
		return writeResult.records[0].get('n')
	} catch (err) {
		console.log('NodeQueries.addUser: ', err)
		throw err
	} finally {
		session.close()
	}
}

const addItem = async (item) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MERGE (n:Item {itemId: $itemId}) 
            SET n.title = $title 
            RETURN n`

		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				itemId: item.id,
				title: item.title,
			})
		)
		return writeResult.records[0].get('n')
	} catch (err) {
		console.log('NodeQueries.addItem: ', err)
		throw err
	} finally {
		session.close()
	}
}

const addCategory = async (category) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MERGE (n:Category {categoryId: $categoryId}) 
            SET n.name = $categoryName 
            RETURN n`

		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				categoryId: category.id,
				categoryName: category.name,
			})
		)
		return writeResult.records[0].get('n')
	} catch (err) {
		console.log('NodeQueries.addCategory: ', err)
		throw err
	} finally {
		session.close()
	}
}

const addMentor = async (mentor) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MERGE (n:Mentor {mentorId: $mentorId}) 
            SET n.name = $mentorName 
            RETURN n`

		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				mentorId: mentor.id,
				mentorName: mentor.name,
			})
		)
		return writeResult.records[0].get('n')
	} catch (err) {
		console.log('NodeQueries.addMentor: ', err)
		throw err
	} finally {
		session.close()
	}
}

const addProvider = async (provider) => {
	const session = neo4jDriver.session()
	try {
		const writeQuery = `
            MERGE (n:Provider {providerId: $providerId}) 
            SET n.name = $providerName 
            RETURN n`

		const writeResult = await session.executeWrite((tx) =>
			tx.run(writeQuery, {
				providerId: provider.id,
				providerName: provider.name,
			})
		)
		return writeResult.records[0].get('n')
	} catch (err) {
		console.log('NodeQueries.addProvider: ', err)
		throw err
	} finally {
		session.close()
	}
}

const deleteAllNodes = async () => {
	const session = neo4jDriver.session()
	try {
		const query = 'MATCH (n) DETACH DELETE n'
		const writeResult = await session.executeWrite((tx) => tx.run(query))
		return {
			nodesDeleted: writeResult.summary.counters._stats.nodesDeleted,
			relationshipsDeleted: writeResult.summary.counters._stats.relationshipsDeleted,
		}
	} catch (err) {
		console.log('NodeQueries.deleteAllNodes: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.nodeQueries = {
	addUser,
	addItem,
	addCategory,
	addProvider,
	addMentor,
	deleteAllNodes,
}
