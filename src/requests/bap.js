'use strict'
const { internalRequests } = require('@helpers/requests')

const runSessionSearch = async (topic) => {
	try {
		await internalRequests.bapPOST({
			route: process.env.BAP_DSEP_SEARCH,
			body: {
				sessionTitle: topic,
				type: 'session',
			},
		})
	} catch (err) {
		console.log('BapRequests.makeBapSearch: ', err)
		throw err
	}
}

exports.bapRequests = { runSessionSearch }
