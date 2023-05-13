'use strict'
const { faker } = require('@faker-js/faker')

exports.generateCategoryNames = (count) => {
	const categorySet = new Set()
	do {
		const first = faker.helpers.arrayElement(firstOptions)
		const second = faker.helpers.arrayElement(secondOptions)
		categorySet.add(`${first} ${second}`)
	} while (categorySet.size !== count)
	return Array.from(categorySet)
}

const firstOptions = [
	'Academic',
	'Educational',
	'Co-curricular',
	'Administrative',
	'Financial',
	'Office',
	'Infrastructure',
]
const secondOptions = ['Leadership', 'Improvement', 'Activities', 'Management', 'Training', 'Analysis', 'Research']
