'use strict'
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
process.env.NEO4J_URL = 'bolt://localhost:7687'

const { neo4jDriver } = require('../configs/neo4j')
const queries = [
	'CREATE CONSTRAINT FOR (p:Topic) REQUIRE p.topicName IS UNIQUE',
	'CREATE CONSTRAINT FOR (p:User) REQUIRE p.userId IS UNIQUE',
	'CREATE CONSTRAINT FOR (p:Item) REQUIRE p.itemId IS UNIQUE',
	'CREATE CONSTRAINT FOR (p:Category) REQUIRE p.categoryId IS UNIQUE',
	'CREATE CONSTRAINT FOR (p:Mentor) REQUIRE p.mentorId IS UNIQUE',
	'CREATE CONSTRAINT FOR (p:Provider) REQUIRE p.providerId IS UNIQUE',
]

const setUniqueConstraints = async () => {
	const session = neo4jDriver.session()
	for (let query of queries) {
		console.log('Running Query: ', query)
		await session
			.run(query)
			.then(() => console.log('DONE\n'))
			.catch((err) => console.log(err))
	}
	session.close()
	process.exit()
}

setUniqueConstraints()
