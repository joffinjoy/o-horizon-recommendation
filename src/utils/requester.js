'use strict'
const axios = require('axios')

exports.postRequest = async (baseURL, route, headers = {}, body) => {
	try {
		baseURL = baseURL.replace(/\/$/, '')
		let url = baseURL + route
		const response = await axios.post(url, body, { headers, timeout: 7000 })
		return response.data
	} catch (err) {
		if (err.response) {
			console.log('Response Data: ', err.response.data)
			console.log('Response Status:', err.response.status)
			console.log('Response Headers', err.response.headers)
		} else if (err.request) console.log(err.request)
		else console.log('Error: ', err.message)
		console.log('Request CONFIG: ', err.config)
	}
}

exports.internalPOSTRequest = (baseURL) => {
	return async ({ headers, body, route }) => await exports.postRequest(baseURL, route, headers, body)
}
