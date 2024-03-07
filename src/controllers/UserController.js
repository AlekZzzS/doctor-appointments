import { AppDataSource } from '../dbConnect.js'
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import { saveToken } from '../redis/redisHandler.js'
import { logger } from '../logger.js'

export class UserService {
    #generateToken(userId) {
        return jwt.sign({ userId }, 'secret_key', { expiresIn: '1h' })
    }

    #isValidPhoneNumber(phone) {
        const phoneRegex = /^\+\d{11}$/
        return phoneRegex.test(phone)
    }

    async authUser(req) {
        const { phone, name } = req
        if (!this.#isValidPhoneNumber(phone)) {
            throw new Error('Invalid phone number format')
        }
        const userRepository = AppDataSource.getRepository(User)
        try {
            let user = await userRepository.findOne({ where: { phone } })
            if (!user) {
                user = new User(phone, name)
                await userRepository.save(user)
            }
            const token = this.#generateToken(user.id)
            await saveToken(user.id, token)
            return { code: '0000', userId: user.id, token }
        } catch (error) {
            logger.error(`Error occurred while authenticating user: ${error.message}`)
            throw error
        }
    }
}