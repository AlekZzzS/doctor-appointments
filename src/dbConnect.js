import { DataSource } from 'typeorm'
import { DoctorSchema } from './models/Doctor.js'
import { UserSchema } from './models/User.js'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '123',
    database: 'doctor_appointments',
    synchronize: true,
    logging: false,
    entities: [UserSchema, DoctorSchema]
})