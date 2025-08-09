import userModel from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";


const JWT_SECRET = "$uperm@n"; 


export const SignUp = async (req, res) => {
    try {
        const { Username, Email, Password, role } = req.body;

        const hashedPassword = await bcryptjs.hash(Password, 10);

        const Newuser = new userModel({
            Username,
            Email,
            Password: hashedPassword,
            role
        });

        const userData = await Newuser.save();

        const payload = {
            _id: userData._id,
            Email: userData.Email,
            role: userData.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const user = userData.toObject();
        delete user.Password;

        return res.status(201).json({
            message: "User Created Successfully",
            userData: user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error Creating User",
            err
        });
    }
}


export const Signin = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const userData = await userModel.findOne({ Email });
        if (!userData) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const isMatch = await bcryptjs.compare(Password, userData.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const payload = {
            _id: userData._id,
            Email: userData.Email,
            role: userData.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const user = userData.toObject();
        delete user.Password;

        res.status(200).json({
            message: 'Logged in Successfully',
            userData: user
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}


export const currentUser = async (req,res) => {
    try{
        const CurrentUser = await userModel.findById(req.user._id).select("-Password");
        res.json(CurrentUser);
    }
    catch(err){
        console.log(err);
    }
}
