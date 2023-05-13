'use strict'
const { itemService } = require('@services/item')
const { failedRes } = require('@utils/failedRes')
const { successRes } = require('@utils/successRes')

const addItem = async (req, res) => {
	try {
		const payload = req.body.payload
		const { item, categories, mentor, provider } = payload
		const result = await itemService.addItem({ item, categories, mentor, provider })
		successRes(res, 'Item Added To Recommendation Engine', result)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.itemController = {
	addItem,
}
