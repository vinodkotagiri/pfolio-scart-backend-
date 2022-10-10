const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: 32,
		},
		password: {
			type: String,
			required: true,
		},
		about: {
			type: String,
			trim: true,
		},
		salt: String,
		role: {
			type: Number,
			default: 0,
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
)

module.exports = model('User', userSchema)
