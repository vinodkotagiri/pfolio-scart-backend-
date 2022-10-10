const Category = require('../models/model.category')

exports.create = async (req, res) => {
	const { name } = req.body

	//Check if category already exists
	const check = await Category.findOne({ name: name.toLowerCase() })
	if (check) return res.status(400).json({ error: 'Category already exists' })
	try {
		const category = await new Category({ name: name.toLowerCase() }).save()
		res.status(201).json({ category })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
