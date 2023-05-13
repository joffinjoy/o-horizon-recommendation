'use strict'
const { nodeQueries } = require('@database/graph/nodeQueries')
const { edgeQueries } = require('@database/graph/edgeQueries')
const { wordsExtractor } = require('@utils/wordsExtractor')

const addItem = async ({ item, categories, mentor, provider }) => {
	try {
		const itemNode = await nodeQueries.addItem(item)
		const mentorNode = await nodeQueries.addMentor(mentor)
		const providerNode = await nodeQueries.addProvider(provider)
		const categoryNodesArray = await Promise.all(
			categories.map(async (category) => await nodeQueries.addCategory(category))
		)

		const itemId = itemNode.properties.itemId
		const providerId = providerNode.properties.providerId
		const mentorId = mentorNode.properties.mentorId
		const topics = wordsExtractor(item.title, ['NN', 'VBG'])
		const categoryIds = []

		await Promise.all([
			edgeQueries.createItemMentorProviderEdges(itemId, providerId, mentorId),
			Promise.all(
				categoryNodesArray.map(async (categoryNode) => {
					await edgeQueries.createBelongsToEdge(itemId, categoryNode.properties.categoryId)
					categoryIds.push(categoryNode.properties.categoryId)
				})
			),
			Promise.all(
				topics.map(async (token) => {
					if (!token.includes('ClusterNumber')) return await edgeQueries.createIsAboutEdge(itemId, token)
					else return true
				})
			),
		])
		return {
			itemId,
			providerId,
			mentorId,
			categoryIds,
		}
	} catch (err) {
		console.log('ItemService.addItem: ', err)
		throw err
	}
}

exports.itemService = { addItem }
