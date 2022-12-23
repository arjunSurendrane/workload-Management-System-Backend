import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: [true, 'user must have an email.id'],
        lowercase: true
    },
    mobile: Number,
    password: {
        type: String,
        select: false
    }
})


const User = mongoose.model('User', userSchema)
export default User