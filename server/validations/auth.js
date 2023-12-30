import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть минимум 5 символов').isLength({
		min: 5,
	}),
	body('fullName', 'укажите имя').isLength({ min: 3 }),
	body('avatarURL', 'Неверная ссылка на аватарку').optional().isURL(),
]
