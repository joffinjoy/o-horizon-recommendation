'use strict'
const { nodeQueries } = require('@database/graph/nodeQueries')
const { readQueries } = require('@database/graph/readQueries')
const { failedRes } = require('@utils/failedRes')
const { successRes } = require('@utils/successRes')

const addUser = async (req, res) => {
	try {
		const { userId, email, name, phone } = req.body
		const userNode = await nodeQueries.addUser({ userId, email, name, phone })
		successRes(res, 'User Added To Recommendation Engine', userNode.properties)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

const getUserEmails = async (req, res) => {
	try {
		const result = await readQueries.getEmailIds()
		const emails = result.records.map((record) => {
			return { emailId: record._fields[0], userId: record._fields[1] }
		})
		successRes(res, 'All User Emails Fetched Successfully', emails)
	} catch (err) {
		console.log(err)
		failedRes(res, 'Something Went Wrong')
	}
}

exports.userController = {
	addUser,
	getUserEmails,
}
