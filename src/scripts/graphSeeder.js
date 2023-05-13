'use strict'

const { generateCategoryNames } = require('./generators/categoryNames')
const { itemTitles } = require('./generators/itemTitles')
const { generateUserNames } = require('./generators/userNames')
const { generateProviderNames } = require('./generators/providerNames')
const { generateMongoObjectId } = require('./generators/mongoObjectId')
const { getObject } = require('./utils/getObject')
const { postRequest } = require('./utils/requester')
const { shuffleArray } = require('./utils/shuffleArray')
const providers = generateProviderNames(10)
const categories = generateCategoryNames(40)
const mentors = generateUserNames(40)
let mentorIndex = -1
let providerIndex = -1
let categoryIndex = -1

const run = async () => {
	try {
		console.time('GraphSeeder-Execution')
		let clusterItems = []
		let clusters = {}
		let clusterNumber = 1
		let provider
		let mentor
		let category
		for (let i = 0; i < itemTitles.length; i++) {
			if (i % 20 === 0) {
				providerIndex++
				provider = getObject(providers[providerIndex])
				clusterItems = []
				clusterNumber = Math.floor(i / 20) + 1
				clusters[`${clusterNumber}`] = clusterItems
			}
			if (i % 5 === 0) {
				mentorIndex++
				mentor = getObject(mentors[mentorIndex])
				categoryIndex++
				category = getObject(categories[categoryIndex])
			}
			const item = {
				id: generateMongoObjectId(),
				title: `${itemTitles[i]} ClusterNumber${clusterNumber}`,
			}
			clusterItems.push(item.id)
			postRequest('/add-item', { payload: { item, provider, mentor, categories: [category] } })
		}
		clusters[`${clusterNumber}`] = clusterItems

		Object.keys(clusters).map(async (clusterNumber) => {
			const users = generateUserNames(15)
			for (let j = 0; j < users.length; j++) {
				const userId = generateMongoObjectId()
				await postRequest('/add-user', {
					userId: userId,
					email: users[j].toLowerCase().replace(/[^a-zA-Z]+/g, '') + clusterNumber + '@shikshalokam.org',
					phone: '9895480000',
					name: users[j],
				})
				const shuffledSessions = shuffleArray(clusters[clusterNumber])
				for (let k = 0; k < 7; k++) {
					await postRequest('/add-rating', {
						userId,
						itemId: shuffledSessions[k],
						rating: Math.floor(Math.random() * 5) + 1,
					})
				}
			}
		})
		console.log('Items, Users & RATINGS Added Successfully')
		console.timeEnd('GraphSeeder-Execution')
	} catch (err) {
		console.log(err)
	}
}

run()
