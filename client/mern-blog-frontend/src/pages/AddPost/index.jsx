import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../axios.js'
import { SelectIsAuth } from '../../redux/slices/auth'
import styles from './AddPost.module.scss'

export const AddPost = () => {
	const navigateUse = useNavigate()
	const [imageUrl, setImageUrl] = useState('')
	const isAuth = useSelector(SelectIsAuth)
	const [title, setTitle] = React.useState('')
	const [tags, setTags] = React.useState('')
	const [value, setValue] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	const inputRef = React.useRef(null)

	const handleChangeFile = async event => {
		try {
			console.log(event.target.files)
			const formData = new FormData()
			formData.append('image', event.target.files[0])
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.url)
		} catch (error) {
			console.warn('ошибка при загрузки файла')
		}
	}

	const onClickRemoveImage = async event => {
		setImageUrl('')
	}

	const onChange = React.useCallback(value => {
		setValue(value)
	}, [])

	const onSubmit = async () => {
		try {
			setIsLoading(true)
			const fields = { title, imageUrl, text: value, tags: tags.split(',') }
			const { data } = await axios.post('/posts', fields)
			const id = data._id
			navigateUse(`/posts/${id}`)
		} catch (error) {
			console.warn('статья не создана :(')
			alert('ошибка при создании статьи')
		}
	}

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)
	if (!isAuth) {
		return <Link to='/login'>Войдите в аккаунт или зарегестрируйтесь</Link>
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputRef.current.click()}
				variant='outlined'
				size='large'
			>
				Загрузить превью
			</Button>
			<input ref={inputRef} type='file' onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`http://localhost:4444${imageUrl}`}
						alt='Uploaded'
					/>
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				value={title}
				onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги'
				value={tags}
				onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={value}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size='large' variant='contained'>
					Опубликовать
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
