const User = require('../models/model.user')

exports.listAll = async (req, res) => {}

exports.read = async (req, res) => {
	req.profile.password = undefined
	return res.status(200).json(req.profile)
}
exports.update = async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.profile._id },
			{ $set: req.body },
			{ new: true }
		)
		res
			.status(200)
			.json({
				_id: updatedUser._id,
				email: updatedUser.email,
				name: updatedUser.name,
			})
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}
