const redis = require('redis');

// redis config
// const redisClient = redis.createClient({
//     port: 6379,
//     host: 'localhost'
// });
const redisClient = redis.createClient();


// Redis connection
redisClient.on('connect', () => console.log('Redis Connection OK!'));
redisClient.on('error', (err) => console.log(`Redis Connection Error! ${err}`));

module.exports = redisClient;