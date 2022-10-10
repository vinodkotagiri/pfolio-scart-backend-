const Product = require('../models/model.product')
// -----------------------------------------------------------------------------
// MIDDLEWARE TO GET PRODUCT BASED ON ID
// -----------------------------------------------------------------------------
exports.productById = async (req, res, next, id) => {
	const product = await Product.findById(id)
	try {
		if (!product) return res.status(404).json({ error: 'Product not found' })
		req.product = product
		next()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.getPhoto = async (req, res, next) => {
	if (req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType)
		return res.send(req.product.photo.data)
	}
	next()
}
