import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { Post } from '../components/Post'
export const FullPost = () => {
	const { id } = useParams()
	console.log(id)
	const [data, setData] = useState()
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		const asyncFunc = async () => {
			try {
				const { data } = await axios.get(`http://localhost:4444/posts/${id}`)
				setData(data)
				setIsLoading(false)
			} catch (error) {
				console.warn(error)
			}
		}
		asyncFunc()
	}, [])
	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />
	}

	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl || ''}
				user={data.user}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				isFullPost
			>
				<p>{data.text}</p>
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
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
			>
				<Index />
			</CommentsBlock>
		</>
	)
}
