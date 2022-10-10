const Product = require('../models/model.product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

exports.create = async (req, res) => {
	let form = new formidable.IncomingForm()
	form.keepExtension = true
	form.parse(req, (err, fields, files) => {
		if (err)
			return res.status(400).json({ error: 'Image couldnot be uploaded' })
		const product = new Product(fields)

		//If the input contains photo
		if (files.photo) {
			//IF file size is greater than 1mb
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size',
				})
			}
			//set product phot data, type
			product.photo.data = fs.readFileSync(files.photo.filepath)
			product.photo.contentType = files.photo.mimetype
		}

		try {
			product.save()
			res.status(201).json({ product })
		} catch (err) {
			res.status(500).json({ error: err.message })
		}
	})
}

exports.read = async (req, res) => {
	req.product.photo = undefined
	return res.json(req.product)
}

exports.remove = async (req, res) => {
	const product = req.product
	try {
		await product.remove()
		res.status(200).json({ message: 'Product removed successfully' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.update = async (req, res) => {
	let form = new formidable.IncomingForm()
	form.keepExtension = true
	form.parse(req, (err, fields, files) => {
		if (err)
			return res.status(400).json({ error: 'Image couldnot be uploaded' })
		let product = req.product
		product = _.extend(product, fields)

		//If the input contains photo
		if (files.photo) {
			//IF file size is greater than 1mb
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size',
				})
			}
			//set product phot data, type
			product.photo.data = fs.readFileSync(files.photo.filepath)
			product.photo.contentType = files.photo.mimetype
		}

		try {
			product.save()
			res.status(201).json({ product })
		} catch (err) {
			res.status(500).json({ error: err.message })
		}
	})
}
exports.getAll = async (req, res) => {
	const products = await Product.find({})
	res.status(200).json({ products })
}
