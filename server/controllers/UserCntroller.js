import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import userModal from '../models/User.js'
dotenv.config({ path: './.env' })
const SECRET = process.env.SECRET
export const register = async (req, res) => {
	try {
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}
		const doc = new userModal({
			fullName: req.body.fullName,
			email: req.body.email,
			passwordHash: hashedPassword,
			avatarUrl: req.body.avatarURL,
		})
		const user = await doc.save()
		const token = jwt.sign(
			{
				_id: user._id,
			},
			SECRET,
			{ expiresIn: 30 }
		)
		const { passwordHash, ...userDoc } = user._doc
		res.json({
			...userDoc,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'статус ошибки 500',
		})
	}
}

export const login = async (req, res) => {
	try {
		const user = await userModal.findOne({ email: req.body.email })
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' })
		}

		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.passwordHash
		)
		if (!isValidPass) {
			return res.status(400).json({ message: 'логин или пароль не верны' })
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			SECRET,
			{ expiresIn: 30 }
		)
		const { passwordHash, ...userDoc } = user._doc
		res.json({
			...userDoc,
			token,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'не удалось авторизоваться',
		})
	}
}

export const getMe = async (req, res) => {
	try {
		const user = await userModal.findById(req.userId)
		if (!user) {
			return res.status(404).json({ message: 'пользователь не найден' })
		}
		const { passwordHash, ...userData } = user._doc
		res.json({ message: 'success', userData })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'ошибка сервера' })
	}
}
