import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import TokenRefresh from '../models/TokenRefresh.js'
import userModal from '../models/User.js'
import { generateRefreshToken } from '../utils/authRefresh.js'
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
			{ expiresIn: '3m' }
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
			{ expiresIn: '3m' }
		)
		const refresh_token = generateRefreshToken()
		const { passwordHash, ...userDoc } = user._doc
		let currentTime = new Date()

		// Добавьте 60 дней к текущему времени
		let expirationTime = new Date(
			currentTime.getTime() + 60 * 24 * 60 * 60 * 1000
		)

		await TokenRefresh.findOneAndDelete({ userId: user._id })

		const tokenDoc = await TokenRefresh.create({
			tokenId: refresh_token.id,
			userId: user._id,
			expiresIn: expirationTime,
		})

		res.json({
			...userDoc,
			token,
			tokenDoc,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'не удалось авторизоваться',
		})
	}
}

export const refresh = async (req, res) => {
	const refresh_token = req.body.refresh_token
	if (!refresh_token) {
		return res.json({ message: 'отсутствует токен сессии' })
	}
	const isUsedToken = await TokenRefresh.findOne({ tokenId: refresh_token })
	if (!isUsedToken) {
		return res.json({ message: 'сессия истекла, авторизуйтесь' })
	}
	const refresh_tokenForUpdate = generateRefreshToken()
	const currentTime = Math.floor(Date.now() / 1000)
	let currentTime1 = new Date()
	let expirationTime = new Date(
		currentTime1.getTime() + 60 * 24 * 60 * 60 * 1000
	)
	if (isUsedToken && currentTime < isUsedToken.expiresIn) {
		await TokenRefresh.findOneAndDelete({ userId: isUsedToken.userId })
		const token = jwt.sign(
			{
				_id: isUsedToken.userId,
			},
			SECRET,
			{ expiresIn: '3m' }
		)

		const refresh_tokenupdated = await TokenRefresh.create({
			tokenId: refresh_tokenForUpdate.id,
			userId: isUsedToken.userId,
			expiresIn: expirationTime,
		})
		res.json({
			token,
			refresh_tokenupdated,
		})
	} else {
		console.log('срок действия сессии истек', isUsedToken)
		return res.json({ message: 'пройдите аутентификацию заново' })
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
