'use strict'
const axios = require('axios')

const config = {
	method: 'post',
	maxBodyLength: Infinity,
	headers: {
		'Content-Type': 'application/json',
	},
}

exports.postRequest = async (url, data) => {
	try {
		config.url = 'http://localhost:3020/recommendation' + url
		config.data = JSON.stringify(data)
		const response = await axios(config)
		return response.data.data
	} catch (err) {
		console.log(err)
		throw err
	}
}
