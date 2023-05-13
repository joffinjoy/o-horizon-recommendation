'use strict'
const { neo4jDriver } = require('@configs/neo4j')

const deleteProjection = async () => {
	const session = neo4jDriver.session()
	try {
		const result = await session.run(
			`
            CALL gds.graph.exists($projectionName) 
            YIELD exists
            `,
			{ projectionName: 'pageRankGraph' }
		)
		if (result.records[0].get('exists')) await session.run("CALL gds.graph.drop('pageRankGraph')")
	} catch (err) {
		console.log('PageRankQueries.deleteProjection: ', err)
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
                'pageRankGraph',
                ['Item','Topic','User'],
                {
                    RATED:{
                        properties: 'rating'
                    },
                    IS_ABOUT:{
                        properties:{
                            rating:{
                                defaultValue: 1
                            }
                        }
                    }
                }
            )
            `
		)
	} catch (err) {
		console.log('PageRankQueries.generateProjection: ', err)
		throw err
	} finally {
		session.close()
	}
}

const runPageRank = async () => {
	const session = neo4jDriver.session()
	try {
		await session.run(
			`CALL gds.pageRank.write('pageRankGraph', {
                maxIterations: 20,
                dampingFactor: 0.85,
                writeProperty: 'pageRank',
                nodeLabels:['Item','Topic','User'],
                relationshipTypes:['RATED','IS_ABOUT'],
                relationshipWeightProperty:'rating'
              })
            `
		)
	} catch (err) {
		console.log('PageRankQueries.runPageRank: ', err)
		throw err
	} finally {
		session.close()
	}
}

exports.pageRankQueries = {
	generateProjection,
	deleteProjection,
	runPageRank,
}
