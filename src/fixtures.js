import { AppDataSource } from './dbConnect.js'
import { User } from './models/User.js'
import { Doctor } from './models/Doctor.js'

async function runFixtures() {
    await AppDataSource.initialize()
    const userRepository = AppDataSource.getRepository(User)
    const doctorRepository = AppDataSource.getRepository(Doctor);

    const userData = [
        { phone: '+12345678901', name: 'Alexey' },
        { phone: '+22222222222', name: 'Maksim' }
    ]

    const doctorData = [
        { firstName: 'Igor', lastName: 'Igorev', surname: 'Igorevich', specialization: 'Терапевт' },
        { firstName: 'Antonina', lastName: 'Doctorovna', surname: 'Sergeevna', specialization: 'Стоматолог' }
    ]

    await Promise.all(userData.map(async (data) => {
        const { phone, name } = data
        const existingUser = await userRepository.findOne({ where: { phone } })
        if (!existingUser) {
            const newUser = new User(phone, name)
            await userRepository.save(newUser)
        } else {
            console.log(existingUser);
        }
    }))

    await Promise.all(doctorData.map(async (data) => {
        const { firstName, lastName, surname, specialization } = data
        const existingDoctor = await doctorRepository.findOne({ where: { firstName, lastName } })
        if (!existingDoctor) {
            const newDoctor = new Doctor(firstName, lastName, surname, specialization)
            await doctorRepository.save(newDoctor)
        }
    }))
}
  
runFixtures()
    .then(() => {
        console.log('Fixtures have been loaded successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Error loading fixtures:', error)
        process.exit(1)
    })