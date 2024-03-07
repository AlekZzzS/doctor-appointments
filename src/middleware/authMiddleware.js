import jwt from 'jsonwebtoken'
import { checkToken } from '../redis/redisHandler.js'
import { logger } from '../logger.js'

export async function authMiddleware(req, res, next) {
    const tokenWithBearer = req.headers.authorization
    const token = tokenWithBearer.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
  
    try {
        const decoded = jwt.verify(token, 'secret_key')
        req.userId = decoded.userId
        const isValidToken = await checkToken(decoded.userId, token)
        if (!isValidToken) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        next()
    } catch (error) {
        logger.error(`Error occurred while authenticating user: ${error.message}`)
        throw error
    }
}