const redis = require('redis');

// redis config
const redisClient = redis.createClient({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASS
});
// const redisClient = redis.createClient();


// Redis connection
redisClient.on('connect', () => console.log('Redis Connection OK!'));
redisClient.on('error', (err) => console.log(`Redis Connection Error! ${err}`));

module.exports = redisClient;