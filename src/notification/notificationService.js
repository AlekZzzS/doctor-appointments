import schedule from 'node-schedule'

export function createReminders(user, doctor, slot) {
    const currentDate = new Date()

    const [hours, minutes] = slot.split(':').map(Number)

    const appointmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, hours, minutes)//Предполагается, что запись идет на завтра.

    // Уведомление за 1 день до приема
    const oneDayBefore = new Date(appointmentDate)
    oneDayBefore.setDate(oneDayBefore.getDate() - 1)
    schedule.scheduleJob(oneDayBefore, function () {
        console.log(`Здравствуйте, ${user.name}! Напоминаем что вы записаны на завтра к ${doctor.firstName} ${doctor.lastName} (${doctor.specialization}) ${slot}!`)
    })

    // Уведомление за 2 часа до приема
    const twoHoursBefore = new Date(appointmentDate);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
    schedule.scheduleJob(twoHoursBefore, function () {
        console.log(`Здравствуйте, ${user.name}! Запись к ${doctor.firstName} ${doctor.lastName} (${doctor.specialization}) через два часа в ${slot}!`)
    })
}