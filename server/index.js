import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import express from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import userModal from './models/User.js'
import { registerValidation } from './validations/auth.js'
dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 5000
const SECRET = process.env.SECRET
const app = express()
app.use(express.json())
mongoose
	.connect(
		'mongodb+srv://admin:admin@cluster0.anhjxo3.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('DB OK')
	})
	.catch(error => {
		console.log('DB error', error)
	})
app.get('/', (req, res) => {
	res.send('hello world!')
})

app.post('/auth/login', async (req, res) => {
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
})
app.get(
	'/auth/me',
	(req, res, next) => {
		const token = req.headers.authorization
		console.log(token)
		if (!token) {
			res.status(400).json({ message: 'иди нахуй' })
		}
		if (token) {
			next()
		}
	},
	async (req, res) => {
		try {
			res.json({ message: 'success' })
		} catch (error) {}
	}
)
app.post('/auth/register', registerValidation, async (req, res) => {
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
})

app.listen(PORT, err => {
	if (err) {
		return err
	}
	console.log(`SERVER START ON PORT ${PORT}`)
})
