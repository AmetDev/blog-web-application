import PostModel from '../models/Post.js'
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags,
			imageUrl: req.body.imageUrl,
			viewsCount: req.body.viewsCount,
			user: req.userId,
		})
		const post = await doc.save()
		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'не удалось создать статью',
		})
	}
}

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		return res.json(posts)
	} catch (error) {
		console.log(error)
		return res.status(400).json('Статьи не найдены')
	}
}

export const getOne = async (req, res) => {
	try {
		console.log(req.params.id)
		const postId = req.params.id
		const doc = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			}
		).populate('user')
		if (!doc) {
			res.status(404).json({ message: 'Статья не найдена' })
		} else {
			res.json(doc)
		}
	} catch (error) {
		console.log(error)
		return res.status(500).json('Не найдена статья')
	}
}

export const removeOne = async (req, res) => {
	try {
		const postId = req.params.id

		const doc = await PostModel.findOneAndDelete({ _id: postId })

		if (!doc) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}

		res.json(doc)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'Произошла ошибка базы данных' })
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id
		await PostModel.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags,
				imageUrl: req.body.imageUrl,
				user: req.userId,
			}
		)
		res.json({ message: 'success' })
	} catch (error) {
		console.log(error)
		return res.status(500).json('Не удалось обновить статью')
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)
		return res.json(tags)
	} catch (error) {
		console.log(error)
		return res.status(400).json('Статьи не найдены')
	}
}
