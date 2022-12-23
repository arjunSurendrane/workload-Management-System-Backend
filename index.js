import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan'
import cores from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoute from './routes/user.js'
import workSpaceRoute from './routes/workSpace.js'
import adminRoute from './routes/admin.js'
import { isUser } from './middleware/userAuth.js';



dotenv.config({ path: './config.env' })
const app = express()
app.use(bodyParser.json());
app.use(logger())
app.use(express.urlencoded());
app.use(cores())


// connected to database
mongoose.set('strictQuery', true)
const db = process.env.MONGODB_KEY.replace('<password>', process.env.PASSWORD)
mongoose.connect(db).then(res => {
    console.log('connected to database')
}).catch(err => {
    console.log('database not connected ' + err)
})



// route setup
app.use('/api/admin', adminRoute)
app.use('/api/user', userRoute)
app.use(isUser)
app.use('/api/workspace', workSpaceRoute)




// connected to localhost 
app.listen(4000, () => {
    console.log('server connencted to localhost : 4000')
})