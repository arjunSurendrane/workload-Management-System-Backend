
import Jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import bcrypt from 'bcryptjs'









export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ status: 'fail', error: 'incorrect email or password' })
    if (!(await bcrypt.compare(password, admin.password))) return res.status(401).json({ status: 'fail', error: 'incorrect email or password' })
    const token = await Jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXP_JWT })
    console.log(token)
    res.status(200).json({
        status: 'success',
        data: 'adminLogin Successfully',
        token
    })
}