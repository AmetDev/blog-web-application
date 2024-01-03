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

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
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
