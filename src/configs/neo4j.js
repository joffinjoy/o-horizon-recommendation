'use strict'
const neo4j = require('neo4j-driver')
exports.neo4jDriver = neo4j.driver(process.env.NEO4J_URL)
