import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserCntroller.js'
import checkAuth from './utils/checkAuth.js'
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

app.post('/auth/login', UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidation, UserController.register)

app.listen(PORT, err => {
	if (err) {
		return err
	}
	console.log(`SERVER START ON PORT ${PORT}`)
})
