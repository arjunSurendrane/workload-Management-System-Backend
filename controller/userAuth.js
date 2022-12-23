import User from "../models/userModel.js"
import Jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'




// create token and send response
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

