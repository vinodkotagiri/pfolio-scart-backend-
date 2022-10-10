const Category = require('../models/model.category')
// -----------------------------------------------------------------------------
// MIDDLEWARE TO GET CATEGORY BASED ON ID
// -----------------------------------------------------------------------------
exports.categoryById = async (req, res, next, id) => {
	const category = await Category.findById(id)
	try {
		if (!category) return res.status(404).json({ error: 'Category not found' })
		req.category = category
		next()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
