import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import TokenRefresh from '../models/TokenRefresh.js'
dotenv.config({ path: './.env' })
const SECRET = process.env.SECRET
export const generateRefreshToken = () => {
	const payload = {
		id: uuidv4(),
		type: 'refresh',
	}
	const options = { expiresIn: '30d' }
	return {
		id: payload.id,
		token: jwt.sign(payload, SECRET, options),
	}
}
export const replaceDbRefreshToken = (tokenId, userId) => {
	TokenRefresh.findOne({ userId })
		.exec()
		.then(() => TokenRefresh.create({ tokenId, userId }))
}
