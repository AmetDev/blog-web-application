import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import * as PostController from './controllers/PostController.js'
import * as UserController from './controllers/UserCntroller.js'
import checkAuth from './utils/checkAuth.js'
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
	.connect(
		'mongodb+srv://admin:admin@cluster0.anhjxo3.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('DB ok')
	})
	.catch(error => {
		console.log('DB error', error)
	})
app.get('/', (req, res) => {
	res.send('hello world!')
})

app.post('/auth/login', loginValidation, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidation, UserController.register)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.removeOne)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)
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
