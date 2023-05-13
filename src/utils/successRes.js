'use strict'

exports.successRes = (res, message, data) => res.status(200).json({ status: true, message, data })
