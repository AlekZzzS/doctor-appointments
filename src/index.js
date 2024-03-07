import express from 'express'
import bodyParser from 'body-parser'
import { AppDataSource } from './dbConnect.js'
import { router } from './routes/router.js'

const app = express()
app.use(bodyParser.json())

AppDataSource.initialize()
    .then(() => {
        app.use('/api', router)
        app.listen(3000, () => {
          console.log('Server is running on http://localhost:3000')
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
