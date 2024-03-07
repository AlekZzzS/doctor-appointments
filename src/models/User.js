import { EntitySchema } from 'typeorm';

export class User {
    constructor(phone, name) {
        this.phone = phone
        this.name = name
    }
}

export const UserSchema = new EntitySchema({
    name: 'User',
    target: User,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        phone: {
            type: 'varchar',
            unique: true
        },
        name: {
            type: 'varchar'
        },
        slots: {
            type: 'json',
            default: []
        }
    }
})