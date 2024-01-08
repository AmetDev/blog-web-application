import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CommentsBlock } from '../components/CommentsBlock'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { fetchPosts, fetchTags } from '../redux/slices/posts'
export const Home = () => {
	const dispatch = useDispatch()
	const [currentId, setCurrentId] = useState('')
	const userData = useSelector(state => state.auth)
	const { posts, tags } = useSelector(state => state.posts)
	const isPostsLoading = posts.status === 'loading'
	console.log(currentId)
	const isTagsLoading = tags.status === 'loading'
	useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
		const someAsyncFunc = async () => {
			try {
				const token = await window.localStorage.getItem('token')
				const { data } = await axios.get('http://localhost:4444/auth/me', {
					headers: { Authorization: `Bearer ${token}` },
				})
				setCurrentId(data.userData._id)
			} catch (error) {}
		}
		someAsyncFunc()
	}, [])

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={0}
				aria-label='basic tabs example'
			>
				<Tab label='Новые' />
				<Tab label='Популярные' />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={obj._id}
								_id={obj._id}
								isLoading={false}
								title={obj.title}
								imageUrl={'http://localhost:4444' + obj.imageUrl || ''}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								//isEditable={true}
								isEditable={currentId === obj.user._id}
								tags={obj.tags}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	)
}
