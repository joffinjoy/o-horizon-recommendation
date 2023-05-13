'use strict'
const { internalPOSTRequest } = require('@utils/requester')

exports.internalRequests = {
	bapPOST: internalPOSTRequest(process.env.BAP_URI),
}
