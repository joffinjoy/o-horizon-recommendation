'use strict'
const { collaborativeFilteringQueries } = require('@database/graph/recommendation/collaborativeFiltering')

const getCollaborativeRecommendations = async (userId) => {
	try {
		const result = await collaborativeFilteringQueries.findSimilarUsers(userId)
		const similarUsers = result.records.map((user) => {
			if (user._fields[0] !== userId) return user._fields[0]
			else return user._fields[1]
		})
		const uniqueSimilarUsers = Array.from(new Set(similarUsers))
		let recommendationItems = []
		for (let similarUser of uniqueSimilarUsers) {
			const results = await collaborativeFilteringQueries.getRecommendedItems(similarUser, userId)
			const items = results.records.map((record) => {
				return {
					itemId: record._fields[0],
					title: record._fields[1],
				}
			})
			recommendationItems = recommendationItems.concat(items)
		}
		return recommendationItems.filter(
			(obj, index, self) => index === self.findIndex((o) => o.itemId === obj.itemId && o.title === obj.title)
		)
	} catch (err) {
		console.log('RecommendationService.getCollaborativeRecommendations: ', err)
		throw err
	}
}

exports.recommendationService = { getCollaborativeRecommendations }
