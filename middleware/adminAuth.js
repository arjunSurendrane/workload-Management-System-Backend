import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

export const isAdmin = async (req, res, next) => {
    try {
        // GETTING TOKEN AND CHECK OF ITS THERE
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ status: 'fail', error: 'permission denied no token in it' })
        // VERIFICATION TOKEN
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode._id) return res.status(401).json({ status: 'fail', error: 'permission denied incorrect token' })
        // CHECK IF USER EXIST
        const admin = await Admin.findOne({ _id: decode._id });
        if (!admin) return res.status(401).json({ status: 'fail', error: 'permission denied no admin exist' })
        req.admin = admin
        next()
    } catch (err) {
        res.status(401).json({ status: 'fail', error: 'permission denied' })
    }
}