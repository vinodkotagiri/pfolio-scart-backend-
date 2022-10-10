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

// =============================================================================
// GET PRODUCTS ON SALE/ARRIVAL
// SALE==> /products?sortBy=sold&order=desc&limit=4
// ARRIVAL==> /products?sortBy=createdAt&order=desc&limit=4
// IF NO params sent, then return all products
// =============================================================================
exports.list = async (req, res) => {
	//Get query parameters from client, if no params found, set defaults as follows
	const order = req.query.order ? req.query.order : 'asc'
	const sortBy = req.query.sortBy ? req.query.sortBy : '_id'
	const limit = req.query.limit ? parseInt(req.query.limit) : 6

	try {
		const products = await Product.find({})
			.select('-photo')
			.populate('category')
			.sort([[sortBy, order]])
			.limit(limit)
		res.status(200).json({ products })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// =============================================================================
// GETS THE PRODUCTS BASED OÑ THE SAME CATEGORY
// =============================================================================
exports.listRelated = async (req, res) => {
	const limit = req.query.limit ? parseInt(req.query.limit) : 6
	try {
		const relatedProducts = await Product.find({
			_id: { $ne: req.product },
			category: req.product.category,
		})
			.limit(limit)
			.populate('category', '_id')
			.select('-photo')
		res.status(200).json({ relatedProducts })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}
exports.listCategories = async (req, res) => {
	try {
		const productCategories = await Product.distinct('category', {})
		res.status(200).json({ productCategories })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
	const order = req.body.order ? req.body.order : 'desc'
	const sortBy = req.body.sortBy ? req.body.sortBy : '_id'
	const limit = req.body.limit ? parseInt(req.body.limit) : 100
	const skip = parseInt(req.body.skip)
	const findArgs = {}

	for (let key in req.body.filters) {
		if (req.body.filters[key].length > 0) {
			if (key === 'price') {
				findArgs[key] = {
					$gte: req.body.filters[key][0],
					$lte: req.body.filters[key][1],
				}
			} else {
				findArgs[key] = req.body.filters[key]
			}
		}
	}
	try {
		const filteredProducts = Product.find(findArgs)
			.select('-photo')
			.populate('category')
			.sort([[sortBy, order]])
			.skip(skip)
			.limit(limit)
		res
			.status(200)
			.json({ size: filteredProducts.length, data: filteredProducts })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
