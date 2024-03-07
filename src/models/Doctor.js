import { EntitySchema } from 'typeorm'

export class Doctor {
    constructor(firstName, lastName, surName, specialization, slots) {
        this.firstName = firstName
        this.lastName = lastName
        this.surName = surName
        this.specialization = specialization
        this.slots = slots
    }
}
  
export const DoctorSchema = new EntitySchema({
    name: 'Doctor',
    target: Doctor,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        firstName: {
            type: 'varchar'
        },
        lastName: {
            type: 'varchar'
        },
        surName: {
            type: 'varchar',
            nullable: true
        },
        specialization: {
            type: 'varchar'
        },
        slots: {
            type: 'json',
            default: ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"]
        }
    }
})