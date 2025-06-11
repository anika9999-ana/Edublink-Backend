import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import customerModel from '../models/customerModel.js'

export const register = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email ||!username|| !password) {
        return res.json({ success: false, message: "Enter All the Details" })
    }
    try {
        const existingUser = await customerModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new customerModel({ email,username, password: hashedPassword });

        await user.save();

        return res.json({ success: true,message:"Register Successfully" ,user});

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email & Password are required" })
    }
    try {
        const user = await customerModel.findOne({ email });
        console.log(user)

        if (!user) {
            return res.json({ success: false, message: "Email is not registered" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id,email:user.email}, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true,token:token,user:user });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

