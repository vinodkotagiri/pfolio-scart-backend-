const { expressjwt: jwt } = require('express-jwt')
const User = require('../models/model.user')

// -----------------------------------------------------------------------------
// MIDDLEWARE TO CHECK THE AUTHENTICATION
// -----------------------------------------------------------------------------
exports.requireSignin = jwt({
	secret: process.env.SECRET,
	algorithms: ['HS256'], // added later
	userProperty: 'auth',
})

// -----------------------------------------------------------------------------
// MIDDLEWARE TO GET USER PROFILE BASED ON ID
// -----------------------------------------------------------------------------
exports.userById = async (req, res, next, id) => {
	const user = await User.findById(id)
	try {
		if (!user) return res.status(404).json({ error: 'User not found' })
		req.profile = user
		next()
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
// -----------------------------------------------------------------------------
// MIDDLEWARE TO CHECK THE AUTHENTICATION OF THE USER
// -----------------------------------------------------------------------------
exports.isAuth = (req, res, next) => {
	const user = req.profile && req.auth && req.profile._id == req.auth._id
	if (!user) return res.status(403).json({ error: 'Access denied!' })
	next()
}

// -----------------------------------------------------------------------------
// MIDDELWARE TO CHECK IF THE LOGGED IN USER IS ADMIN
// -----------------------------------------------------------------------------
exports.isAdmin = (req, res, next) => {
	if (req.profile.role !== 1)
		return res.status(403).json({ error: 'Access denied, You are not admin!' })
	next()
}
