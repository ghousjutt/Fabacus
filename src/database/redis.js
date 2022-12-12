const redis = require('redis')

/**
 * 
 * @returns redisClient
 */
const ConnectToRedis = async () => {
    let redisClient = redis.createClient();

    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
    return redisClient

}

module.exports = { ConnectToRedis }