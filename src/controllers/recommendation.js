'use strict'

const { collaborativeFilteringQueries } = require('@database/graph/recommendation/collaborativeFiltering')
const { contentFilteringQueries } = require('@database/graph/recommendation/contentFiltering')
const { pageRankQueries } = require('@database/graph/recommendation/pageRank')
const { autoSearchService } = require('@services/autoSearch')
const { nodeQueries } = require('@database/graph/nodeQueries')
const { recommendationService } = require('@services/recommendation')
const { failedRes } = require('@utils/failedRes')
const { successRes } = require('@utils/successRes')

const getCollaborativeRecommendations = async (req, res) => {
	try {
		const userId = req.body.userId
		const recommendedItems = await recommendationService.getCollaborativeRecommendations(userId)
		successRes(res, `Recommendations For User: ${userId} Retrieved`, recommendedItems)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const recomputeCollaborativeSimilarity = async (req, res) => {
	try {
		await collaborativeFilteringQueries.deleteProjection()
		await collaborativeFilteringQueries.deleteCollabSimilarRelationships()
		await collaborativeFilteringQueries.generateProjection()
		await collaborativeFilteringQueries.runFRP()
		await collaborativeFilteringQueries.runKNN()
		successRes(res, 'Collaborative Filtering Recomputed Successfully')
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const recomputeContentSimilarity = async (req, res) => {
	try {
		await contentFilteringQueries.deleteProjection()
		await contentFilteringQueries.deleteContentSimilarRelationships()
		await contentFilteringQueries.generateProjection()
		await contentFilteringQueries.runNodeSimilarity()
		successRes(res, 'Content Similarity Recomputed Successfully')
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const getItemPageRecommendations = async (req, res) => {
	try {
		const itemId = req.body.itemId
		const similarItems = await contentFilteringQueries.getSimilarItems(itemId)
		successRes(res, 'Item Page Recommendations Fetched', similarItems)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const getProfilePageRecommendations = async (req, res) => {
	try {
		const userId = req.body.userId
		const similarItems = await contentFilteringQueries.getProfilePageItems(userId)
		successRes(res, 'Profile Page Recommendations Fetched', similarItems)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const recomputePageRank = async (req, res) => {
	try {
		await pageRankQueries.deleteProjection()
		await pageRankQueries.generateProjection()
		await pageRankQueries.runPageRank()
		successRes(res, 'PageRank Computed Successfully')
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const triggerAutoSearch = async (req, res) => {
	try {
		const command = req.query.command
		const result = await autoSearchService.triggerAutoSearch(command)
		successRes(res, 'AutoSearch Command Received Successfully', result)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const deleteAllNodes = async (req, res) => {
	try {
		const result = await nodeQueries.deleteAllNodes()
		successRes(res, 'All Nodes Deleted', result)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.recommendationController = {
	getCollaborativeRecommendations,
	recomputeCollaborativeSimilarity,
	recomputeContentSimilarity,
	getItemPageRecommendations,
	getProfilePageRecommendations,
	recomputePageRank,
	triggerAutoSearch,
	deleteAllNodes,
}
