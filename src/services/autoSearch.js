'use strict'

const cron = require('node-cron')
const { autoSearchQueries } = require('@database/graph/recommendation/autoSearch')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')
const { bapRequests } = require('@requests/bap')

const autoSearchTask = cron.schedule(
	`*/${parseInt(process.env.AUTO_SEARCH_INTERVAL_IN_MINUTES)} * * * *`,
	async () => {
		const min = parseInt(process.env.RANDOM_SKIP_MIN)
		const max = parseInt(process.env.RANDOM_SKIP_MAX)
		const randomSkipCount = Math.floor(Math.random() * (max - min + 1)) + min
		const importantTopics = await autoSearchQueries.getImportantTopics(
			0,
			parseInt(process.env.AUTO_SEARCH_TOP_TOPICS_COUNT)
		)
		const secondaryTopics = await autoSearchQueries.getImportantTopics(
			randomSkipCount,
			parseInt(process.env.AUTO_SEARCH_RANDOM_TOPICS_COUNT)
		)
		const topics = importantTopics.records.concat(secondaryTopics.records)
		for (const record of topics) await bapRequests.runSessionSearch(record.get('topic'))
		await contentFilteringQueries.deleteProjection()
		await contentFilteringQueries.deleteContentSimilarRelationships()
		await contentFilteringQueries.generateProjection()
		await contentFilteringQueries.runNodeSimilarity()
	},
	{
		scheduled: false,
	}
)

const triggerAutoSearch = async (command) => {
	try {
		if (command === 'start') {
			autoSearchTask.start()
			return 'Auto-Search Started'
		}
		autoSearchTask.stop()
		return 'Auto-Search Stopped'
	} catch (err) {
		console.log('autoSearchService.triggerAutoSearch: ', err)
		throw err
	}
}

exports.autoSearchService = { triggerAutoSearch }
