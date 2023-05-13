'use strict'
const { generateMongoObjectId } = require('../generators/mongoObjectId')

exports.getObject = (name) => {
	return {
		id: generateMongoObjectId(),
		name,
	}
}
