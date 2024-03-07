import redis from 'redis'

export const redisClient = redis.createClient({
    socket: {
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || 'localhost'
    }
})

redisClient.on('connect', function() {
    console.log('Connected to Redis')
})
await redisClient.connect()