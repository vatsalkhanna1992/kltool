const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const Users = require('./models/users')
require('./utils/dbconnect')

const app = express()
const port = process.env.PORT || 3002
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup static directory to use.
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap-material-design/dist/js')))
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap-material-design/dist/css')))

// Set views engine to use handlebars.
app.set('view engine', 'hbs')
// Set views path.
app.set('views', viewsPath)
// Register Partials.
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index')
})

app.post('/dashboard', (req, res) => {
    console.log(req.body)
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/user/registration', (req, res) => {
    const user = new Users({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
    })
    user.save().then(() => {
        res.render('dashboard', {
            firstName: req.body.first_name,
            lastName: req.body.last_name
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

// Start server.
app.listen(port, () => {
    console.log('Server is up and running at port ' + port)
})
