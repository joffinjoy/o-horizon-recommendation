'use strict'

exports.failedRes = (res, message) => res.status(400).json({ status: false, message })
