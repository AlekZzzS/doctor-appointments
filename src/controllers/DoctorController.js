import { AppDataSource } from '../dbConnect.js'
import { Doctor } from '../models/Doctor.js'
import { User } from '../models/User.js'
import { createReminders } from '../notification/notificationService.js'

export class DoctorService {
    async createDoctor(req) {
        try {
            const { firstName, lastName, surName, specialization, slots } = req
            const doctorRepository = AppDataSource.getRepository(Doctor)

            if (!Array.isArray(slots)) {
                throw new Error('Slots must be an array')
            }

            for (const slot of slots) {
                if (!/^([01]\d|2[0-3]):?([0-5]\d)$/.test(slot)) {
                    throw new Error('Invalid slot format. Use "HH:MM" format')
                }
            }

            const doctor = new Doctor(firstName, lastName, surName, specialization, slots)
            await doctorRepository.save(doctor)
            return doctor
        } catch (error) {
            throw new Error(`Error occurred while creating doctor: ${error.message}`)
        }
    }
    
    async getDoctors() {
        try {
            const doctorRepository = AppDataSource.getRepository(Doctor)
            return doctorRepository.find()
        } catch (error) {
            throw new Error(`Error occurred while getting doctors: ${error.message}`)
        }
    }

    async bookAppointment(req) {
        try {
            const { doctorId, slot } = req.body
            const userId = req.userId
            const doctorRepository = AppDataSource.getRepository(Doctor)
            const doctor = await doctorRepository.findOne({ where: { id: doctorId } })
            if (!doctor) throw new Error('Doctor not found')

            const { slots } = doctor
            if (!slots.includes(slot)) throw new Error('Slot not available')

            slots.splice(slots.indexOf(slot), 1)
            doctor.slots = slots
            await doctorRepository.save(doctor)

            const userRepository = AppDataSource.getRepository(User)
            let user = await userRepository.findOne({ where: { id: userId } })

            user.slots.push({ [doctorId]: slot })
            await userRepository.save(user)

            createReminders(user, doctor, slot)

            return { doctor, slot, userId }
        } catch (error) {
            throw new Error(`Error occurred while booking appointment: ${error.message}`)
        }
    }

    async getUserAppointments(userId) {
        try {
            const userRepository = AppDataSource.getRepository(User)
            let user = await userRepository.findOne({ where: { id: userId } })

            let appointments = []

            for (let record of user.slots) {
                const doctorId = Object.keys(record)[0]
                const slot = record[doctorId]

                const doctorRepository = AppDataSource.getRepository(Doctor)
                const doctor = await doctorRepository.findOne({ where: { id: doctorId } })

                if (doctor) {
                    appointments.push({
                        name: `${doctor.firstName} ${doctor.lastName}`,
                        specialization: doctor.specialization,
                        time: slot
                    })
                }
            }
            return appointments
        } catch (error) {
            throw new Error(`Error occurred while getting user appointments: ${error.message}`)
        }
    }
}