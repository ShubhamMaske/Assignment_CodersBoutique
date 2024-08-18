import bcrypt from 'bcrypt';
import Joi from "joi";
import JwtService from "../services/jwtService.js";
import User from '../models/user.js';
import nodemailer from 'nodemailer';

// Sign-Up function
export const signUp = async (req, res) => {
        // validate the request body
        const resgisterSchema = Joi.object({
            name: Joi.string().min(2).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
        })

        const {error} = resgisterSchema.validate(req.body)

        if(error){
            res.status(401).json({ message: error.message });
        }

        try {
            // check user is already exist or not
            const { name, email, password } = req.body
            let user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            // creating the user
            user = await User.create({ name, email, password: hashedPassword });
            // console.log(user)
            res.status(201).json({ message: 'User registered successfully' });

        } catch(err) {
            console.log(err.message)
            res.status(500).json({ message: "Server error" });
        }
};

// Login function
export const login = async (req, res) => {
        // validate the request body
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(/^[a-zA-Z0-9@]{3,30}$/).required(),
        })

        const {error} = loginSchema.validate(req.body)

        if(error){
            res.status(401).json({ message: error.message });
        }

        // check user is authorize or not
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } });
            if(!user) {
                res.status(400).json({ message: 'Invalid credentials' });
            }

            // validating the password
            const validPassword = await bcrypt.compare(password, user.password)

            if(!validPassword) {
                res.status(400).json({ message: 'Invalid credentials' });
            }

            const access_token = JwtService.sign({ userId: user.id, role: user.role})
            const refresh_token = JwtService.sign({ userId: user.id, role: user.role}, '1D', process.env.JWT_REFRESH_SECRET)
            const refreshTokenExpiry = Date.now() + (24 * 60 * 60 * 1000);

            user.refresh_token = refresh_token
            user.refreshTokenExpiry = refreshTokenExpiry; 
            user.save()

            res.json({access_token, refresh_token, user : {id: user.id, name: user.name}})

        } catch(err) {
            res.status(500).json({ message: err.message});
        }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const resetToken = JwtService.sign({ userId: user.id }, '1h', process.env.JWT_SECRET);
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
      await user.save();
  
      // Send email (using nodemailer)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const receiver = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: `Please use the following token to reset your password: ${resetToken}`,
      };
  
      transporter.sendMail(receiver, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Email sent: ' + info.response);
      });
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
      res.status(500).json({ message: 'Server error for email send' });
    }
};

// Reset Password function
export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.update({ password: hashedPassword }, { where: { id: req.user.userId } })
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
