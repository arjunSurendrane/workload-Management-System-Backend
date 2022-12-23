import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const isUser = async (req, res, next) => {
    try {
        // GETTING TOKEN AND CHECK OF ITS THERE
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ status: 'fail', error: 'permission denied no token in it' })
        // VERIFICATION TOKEN
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode.id) return res.status(401).json({ status: 'fail', error: 'permission denied incorrect token' })
        // CHECK IF USER EXIST
        const user = await User.findOne({ _id: decode.id });
        if (!user) return res.status(401).json({ status: 'fail', error: 'permission denied no user exist' })
        req.user = user
        next()
    } catch (err) {
        res.status(401).json({ status: 'fail', error: 'permission denied' })
    }
}