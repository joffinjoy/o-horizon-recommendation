'use strict'
const router = require('express').Router()
const { userController } = require('@controllers/user')
const { itemController } = require('@controllers/item')
const { ratingController } = require('@controllers/rating')
const { recommendationController } = require('@controllers/recommendation')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('@apidocs/openapi.json')

router.post('/add-user', userController.addUser)
router.post('/add-item', itemController.addItem)
router.post('/add-rating', ratingController.addRating)

router.get('/recompute-pagerank', recommendationController.recomputePageRank)
router.get('/recompute-collaborative-similarity', recommendationController.recomputeCollaborativeSimilarity)
router.get('/trigger-auto-search', recommendationController.triggerAutoSearch)
router.get('/recompute-content-similarity', recommendationController.recomputeContentSimilarity)

router.post('/get-collaborative-recommendations', recommendationController.getCollaborativeRecommendations)
router.post('/get-item-page-recommendations', recommendationController.getItemPageRecommendations)
router.post('/get-profile-page-recommendations', recommendationController.getProfilePageRecommendations)

router.get('/get-user-emails', userController.getUserEmails)
router.get('/delete-all-nodes', recommendationController.deleteAllNodes)

router.use('/api-docs', swaggerUi.serve)
router.get('/api-docs', swaggerUi.setup(swaggerDocument))

module.exports = router
