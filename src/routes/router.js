import express from 'express'
import { UserService } from '../controllers/UserController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { DoctorService } from '../controllers/DoctorController.js'

export const router = express.Router()
const doctorService = new DoctorService()
const userService = new UserService()

router.route('/users')
    .post(async (req, res) => {
        try {
            const user = await userService.authUser(req.body)
            res.status(201).json(user)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

router.use(authMiddleware)
router.route('/doctors')
    .post(async (req, res) => {
        try {
            const doctor = await doctorService.createDoctor(req.body)
            res.status(201).json(doctor)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })
    .get(async (req, res) => {
        try {
            const doctors = await doctorService.getDoctors()
            res.json(doctors)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
})

router.post('/appointments', async (req, res) => {
    try {
        const appointment = await doctorService.bookAppointment(req)
        res.status(201).json(appointment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/users/:userId/appointments', async (req, res) => {
    const { userId } = req.params
    try {
        const appointments = await doctorService.getUserAppointments(userId)
        res.json(appointments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})