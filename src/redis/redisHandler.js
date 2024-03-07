import { redisClient } from './redisConnect.js'

export async function saveToken(userId, token) {
    try {
        const userIdString = String(userId)
        await redisClient.set(userIdString, token, 'EX', 3600)
    } catch (error) {
        console.error('Error saving token to Redis:', error.message)
    }
}

export async function checkToken(userId, token) {
    try {
        const userIdString = String(userId)
        const storedToken = await redisClient.get(userIdString)
        return storedToken === token
    } catch (error) {
        console.error(`Error occurred while checking token: ${error.message}`)
        return false
    }
}