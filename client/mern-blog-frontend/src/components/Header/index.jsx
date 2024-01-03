import Button from '@mui/material/Button'
import React from 'react'

import Container from '@mui/material/Container'
import { useDispatch, useSelector } from 'react-redux'
import { SelectIsAuth, logout } from '../../redux/slices/auth'
import styles from './Header.module.scss'

export const Header = () => {
	const isAuth = useSelector(SelectIsAuth)
	const dispatch = useDispatch()
	const onClickLogout = () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			dispatch(logout())
			window.localStorage.removeItem('token')
		}
	}

	return (
		<div className={styles.root}>
			<Container maxWidth='lg'>
				<div className={styles.inner}>
					<a className={styles.logo} href='/'>
						<div>ARCHAKOV BLOG</div>
					</a>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<a href='/posts/create'>
									<Button variant='contained'>Написать статью</Button>
								</a>
								<Button
									onClick={onClickLogout}
									variant='contained'
									color='error'
								>
									Выйти
								</Button>
							</>
						) : (
							<>
								<a href='/login'>
									<Button variant='outlined'>Войти</Button>
								</a>
								<a href='/register'>
									<Button variant='contained'>Создать аккаунт</Button>
								</a>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	)
}
