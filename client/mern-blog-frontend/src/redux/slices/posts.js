import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../../src/axios.js'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts')
	return data
})
const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
}

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('posts/tags')
	return data
})
export const fetchRemovePosts = createAsyncThunk(
	'posts/fetchRemovePosts',
	async id => {
		const { data } = await axios.delete(`posts/${id}`)
		return data
	}
)

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		//удаление статьи
		[fetchRemovePosts.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(
				obj => obj._id !== action.meta.arg
			)
		},

		//получение статьи
		[fetchPosts.pending]: (state, action) => {
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.status = 'loaded'
			state.posts.items = action.payload
		},
		[fetchPosts.rejected]: (state, action) => {
			state.posts.status = 'error'
			state.posts.items = []
		},

		//получение тегов
		[fetchTags.pending]: (state, action) => {
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.status = 'loaded'
			state.tags.items = action.payload
		},
		[fetchTags.rejected]: (state, action) => {
			state.tags.status = 'error'
			state.tags.items = []
		},
	},
})
export const postsReducer = postsSlice.reducer
