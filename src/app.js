const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const userRouter = require('./routers/users')
require('./utils/dbconnect')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup express middleware
/* app.use((req, res, next) => {
    res.status(503).send('Site is currently under maintenance. Check back soon!')
}) */

// Setup static directory to use.
app.use(cookieParser())
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap-material-design/dist/js')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-material-design/dist/css')))
app.use(userRouter)

// Set views engine to use handlebars.
app.set('view engine', 'hbs')
// Set views path.
app.set('views', viewsPath)
// Register Partials.
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index')
})

/* app.post('/dashboard', (req, res) => {
    console.log(req.body)
}) */

app.get('/register', (req, res) => {
    res.render('register')
})

// Start server.
app.listen(port, () => {
    console.log('Server is up and running at port ' + port)
})
