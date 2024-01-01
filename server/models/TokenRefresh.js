import mongoose from 'mongoose'

const TokenScheme = new mongoose.Schema(
	{
		tokenId: { type: String, required: true, unique: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
		expiresIn: { type: Number, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Token', TokenScheme)
