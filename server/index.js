import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import * as PostController from './controllers/PostController.js'
import * as UserController from './controllers/UserCntroller.js'

import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import {
	loginValidation,
	postCreateValidation,
	registerValidation,
} from './validations/validation.js'
dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

mongoose
	.connect(`${process.env.URI}`)
	.then(() => {
		console.log('DB ok')
	})
	.catch(error => {
		console.log('DB error', error)
	})
app.get('/', (req, res) => {
	res.send('hello world!')
})

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)

app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)

app.get('/auth/me', checkAuth, UserController.getMe)
app.delete('/posts/:id', checkAuth, PostController.removeOne)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})
app.use('/uploads', express.static('uploads'))
//app.put('/posts/:id', checkAuth, PostController.update)
app.listen(PORT, err => {
	if (err) {
		return err
	}
	console.log(`SERVER START ON PORT ${PORT}`)
})
