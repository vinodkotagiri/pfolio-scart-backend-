const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { ObjectId } = Schema.Types
const productSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxLength: 32,
		},
		description: {
			type: String,
			trim: true,
			required: true,
			maxLength: 2000,
		},
		price: {
			type: Number,
			trim: true,
			required: true,
		},
		category: {
			type: ObjectId,
			ref: 'Category',
			required: true,
		},
		quantity: {
			type: Number,
		},
		sold: {
			type: Number,
			default: 0,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		shipping: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

module.exports = model('Product', productSchema)
