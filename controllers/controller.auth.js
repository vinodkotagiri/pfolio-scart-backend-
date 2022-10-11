const User = require('../models/model.user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// -----------------------------------------------------------------------------
// CONTROLER FOR SIGNING UP USER
// -----------------------------------------------------------------------------
exports.signup = async (req, res) => {
	const { name, email, password } = req.body

	//Check if the user with email exists
	const check = await User.findOne({ email })
	if (check)
		return res.status(400).json({ error: 'User with email already exists' })
	try {
		//Create a hashed password
		const hashedPassword = await bcrypt.hash(password, 12)
		const user = await new User({
			name,
			email,
			password: hashedPassword,
		}).save()
		res.status(201).json({
			user: {
				name: user.name,
				email: user.email,
			},
		})
	} catch (error) {
		return res
			.status(500)
			.json({ error: 'Internal Server Error', message: error })
	}
}

// -----------------------------------------------------------------------------
// CONTROLLER FOR USER SIGNIN
// -----------------------------------------------------------------------------
exports.signin = async (req, res) => {
	const { email, password } = req.body
	//Find the user exists
	const user = await User.findOne({ email: email.toLowerCase() }).lean()
	if (!user) return res.status(400).json({ error: 'User doesnot exist' })
	if (!(await bcrypt.compare(password, user.password)))
		return res.status(400).json({ error: 'Password mismatch' })

	//If everything is ok generate a signed token
	const token = await jwt.sign(
		{ _id: user._id, email: user.email },
		process.env.SECRET
	)
	//Persist the token as a cookie with expiry date
	res.cookie('t', token, { expire: new Date() + 9999 })

	return res.status(200).json({
		token,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			history: user.history,
		},
	})
}

// -----------------------------------------------------------------------------
// CONTROLLER FOR SIGNOUT USER
// -----------------------------------------------------------------------------
exports.signout = async (req, res) => {
	res.clearCookie('t')
	res.status(200).json({ message: 'Successfully signed out' })
}
