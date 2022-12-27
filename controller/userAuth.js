import User from "../models/userModel.js"
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import Otp from "../models/otpVerification.js";




// create  and send token
const successresponse = async (res, statusCode, data) => {
    let token = await Jwt.sign({ id: data._id, email: data.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXP_JWT
    })
    console.log(token)
    res.status(statusCode).json({
        status: 'success',
        data,
        token
    })
}

// send error response
const errorResponse = async (res, statusCode, error) => {
    res.status(statusCode).json({
        status: 'fail',
        error
    })
}



// nodemailer

const sendOtp = (email, otp) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })

    let details = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Email Verification",
        text: "body of the email",
        html: `<h1>Welcome To Onus</h1> 
                <h2>OTP : ${otp}</h2>`
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log({ err })
        } else {
            console.log("email has sent")
        }
    })
}


// user login
export const login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        const newUser = await User.findOne({ email }).select('+password')
        if (!newUser) return errorResponse(res, 401, 'user doesnot exist');
        console.log(newUser)
        const comparePassword = await bcrypt.compare(password, newUser.password);
        if (!comparePassword) return errorResponse(res, 401, 'incorrect password');
        successresponse(res, 200, { name: newUser.name, email: newUser.email, _id: newUser._id })
    } catch (err) {
        errorResponse(res, 401, `error ${err}`)
    }
}

// user signup
export const signup = async (req, res) => {
    const { email, password, name, mobile } = req.body
    const bcryptPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
        email,
        name,
        password: bcryptPassword,
        mobile
    });
    try {
        await newUser.save();
        successresponse(res, 201, newUser)
    } catch (error) {
        errorResponse(res, 404, error)
    }
}


// generate otp
export const sendEmail = async (req, res) => {
    const { email } = req.body
    console.log(email)
    const otp = otpGenerator.generate(5, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
    console.log(otp)
    try {
        const Otps = new Otp({ email, otp })
        const user = await User.findOne({ email })
        if (user) return errorResponse(res, 406, 'already have an account')
        sendOtp(email, otp)
        // successresponse(res, 201, { email })
        res.status(200).json({
            status: 'success'
        })
        Otps.save()
    } catch (error) {
        errorResponse(res, 404, error)
    }
}



// email otp verification
export const emailVerifiction = async (req, res) => {
    try {
        console.log(req.body)
        const { email, otp, name, password } = req.body
        const bcryptPassword = await bcrypt.hash(password, 12)
        const emailOtp = await Otp.find({ email })
        if (!emailOtp.length) return errorResponse(res, 401, 'invalid otp')
        let length = emailOtp.length
        if (!(otp == emailOtp[length - 1].otp)) return errorResponse(res, 401, 'invalid otp')
        const user = await User.create({ name, email, password: bcryptPassword });
        successresponse(res, 200, user)
        await Otp.deleteMany({ email })
    } catch (error) {
        console.log(error)
        errorResponse(res, 404, error)
    }
}


// forgot password 
export const generateOtpForOtpLogin = async (req, res) => {
    try {
        const { email } = req.body
        console.log(email)
        const user = await User.findOne({ email });
        if (!user) return errorResponse(res, 406, 'user not found')
        const otp = otpGenerator.generate(5, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        console.log(otp)
        const Otps = new Otp({ email, otp })
        sendOtp(email, otp)
        res.status(200).json({ status: 'success' })
        Otps.save()
    } catch (error) {
        errorResponse(res, 404, `${error}`)
    }
}


// verify otp for otp login
export const verifyOtp = async (req, res) => {
    try {
        console.log(req.body)
        const { otp, email } = req.body;
        const emailOtp = await Otp.find({ email })
        if (!emailOtp.length) return errorResponse(res, 401, 'invalid otp')
        let length = emailOtp.length
        if (!(otp == emailOtp[length - 1].otp)) return errorResponse(res, 401, 'invalid otp')
        const user = await User.findOne({ email });
        successresponse(res, 200, user)
        await Otp.deleteMany({ email })
    } catch (error) {
        errorResponse(res, 404, `${error}`)
    }
}
