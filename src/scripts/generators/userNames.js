'use strict'
const { faker } = require('@faker-js/faker')

exports.generateUserNames = (count) => {
	const mentorSet = new Set()
	do {
		mentorSet.add(faker.name.fullName())
	} while (mentorSet.size !== count)
	return Array.from(mentorSet)
}
