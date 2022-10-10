// -----------------------------------------------------------------------------
// IMPORT REQUIRED MODULES
// -----------------------------------------------------------------------------
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/route.auth')
const categoryRoutes = require('./routes/route.category')
const productRoutes = require('./routes/route.product')
// -----------------------------------------------------------------------------
// CREATE AND SETUP EXPRESS APP
// -----------------------------------------------------------------------------
const app = express()
const PORT = process.env.PORT || 8000

// -----------------------------------------------------------------------------
// ADD ESSENTIAL MIDDLEWARE
// -----------------------------------------------------------------------------
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// -----------------------------------------------------------------------------
// ROUTES
// -----------------------------------------------------------------------------

app.use('/auth', authRoutes)
app.use('/category', categoryRoutes)
app.use('/product', productRoutes)
// -----------------------------------------------------------------------------
// CONNECT THE DATABASE
// -----------------------------------------------------------------------------
mongoose.connect(process.env.DB_URI, () => {
	console.log('Database connected')
})

app.listen(PORT, () => console.log('listening on port ' + PORT))
