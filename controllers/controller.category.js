const Category = require('../models/model.category')

exports.create = async (req, res) => {
	const { name } = req.body
	console.log(req.body)
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

exports.read = async (req, res) => {
	return res.json(req.category)
}
exports.getAll = async (req, res) => {
	const categories = await Category.find({})
	res.status(200).json({ categories })
}
exports.update = async (req, res) => {
	const { name } = req.body
	const { _id } = req.category
	try {
		await Category.updateOne({ _id }, { $set: { name: name } })
		res.status(201).json({ message: 'Updated' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
exports.remove = async (req, res) => {
	const category = req.category
	try {
		await category.remove()
		res.status(200).json({ message: 'Category removed successfully' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
