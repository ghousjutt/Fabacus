const express = require('express')
const getToken = require('./get-token')
const setToken = require('./set-token')
const updateToken = require('./update-token')
const router = express.Router()

module.exports = () => {
    router.get('/check', getToken)
    router.post('/generate', setToken)
    router.put('/redeem', updateToken)
    return router
}