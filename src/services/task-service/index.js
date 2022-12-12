const { ConnectToRedis } = require("../../database/redis");
const { v4: uuidv4 } = require('uuid');

/**
 * 
 * @param {req} req 
 * @param {res} res 
 */
const getTask = async (req, res) => {
    try {
        const { token } = req.query
        let redisClient = await ConnectToRedis()
        const value = await redisClient.get("tokens")
        let _status = JSON.parse(value).find(el => el.token === token)
        await redisClient.quit()
        res.status(200).json({ status: _status.status })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};

/**
 * 
 * @param {req} req 
 * @param {res} res 
 */
const createTask = async (req, res) => {
    try {
        const { tokens } = req.query
        let coupons = []
        let redisClient = await ConnectToRedis()

        for (let i = 0; i < tokens; i++) {
            coupons.push({ status: 'available', created: new Date(), token: uuidv4() })
        }

        await redisClient.setEx("tokens", 600, JSON.stringify(coupons));
        const _tokens = await redisClient.get("tokens")
        await redisClient.quit()
        res.status(201).json({ created: new Date(), tokens: JSON.parse(_tokens).map(el => el.token) })
    } catch (err) {
        res.status(500).json({ error: err.message })

    }
}

/**
 * 
 * @param {req} req 
 * @param {res} res 
 */
const updateTask = async (req, res, next) => {
    try {
        const { tokenId } = req.query;
        let redisClient = await ConnectToRedis()
        const value = await redisClient.get("tokens")
        let tokensArray = JSON.parse(value)
        let tokenObj = tokensArray.find(el => el.token === tokenId)
        let checkDate = tokenObj < new Date() / 1000
        if (checkDate) {
            let _index = tokensArray.findIndex(x => x.token === tokenId)
            tokensArray[_index].status = 'expired'
            await redisClient.setEx("tokens", 600, JSON.stringify(tokensArray));
            res.status(410).json({ result: 'expired' })
        } else if (tokenObj.status === 'available') {
            let _index = tokensArray.findIndex(x => x.token === tokenId)
            tokensArray[_index].status = 'redeemed'
            await redisClient.setEx("tokens", 600, JSON.stringify(tokensArray));
            res.status(200).json({ result: 'ok' })
        } else if (tokenObj.status === 'redeemed') {
            res.status(410).json({ result: 'redeemed' })
        }
        await redisClient.quit()

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}


module.exports = {
    getTask,
    createTask,
    updateTask
}